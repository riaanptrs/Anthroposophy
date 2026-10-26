"""Build the OFL display-font derivative from two separately downloaded originals.
Usage: python scripts/prepare-display-font.py /path/to/Almendra-Regular.ttf /path/to/Almendra-Bold.ttf
Originals: https://github.com/google/fonts/tree/main/ofl/almendra
Rename the derivative so the original Reserved Font Name remains respected.
"""
from fontTools.ttLib import TTFont
from fontTools import subset
from pathlib import Path
import hashlib,json,sys
assert len(sys.argv)==3, 'Supply both original Regular and Bold TTF files.'
folder=Path(__file__).parent/'assets/identity/fonts'
registry=json.loads((folder/'font-sources.json').read_text())
registry['fonts']=[f for f in registry['fonts'] if f['family']!='Unfolding Display']
required='ÁÀÂÃÉÊÍÓÔÕÚÜÇáàâãéêíóôõúüç'
for source in map(Path,sys.argv[1:]):
 style='Bold' if 'Bold' in source.name else 'Regular'
 font=TTFont(source);assert all(ord(c) in font.getBestCmap() for c in required)
 options=subset.Options();options.name_IDs=['*'];options.name_legacy=True;options.name_languages=['*']
 sub=subset.Subsetter(options=options);sub.populate(unicodes=set(range(0x20,0x250))|set(range(0x2000,0x2070)));sub.subset(font)
 names={1:'Unfolding Display',2:style,3:'UnfoldingDisplay-'+style+'-2026',4:'Unfolding Display '+style,6:'UnfoldingDisplay-'+style,16:'Unfolding Display',17:style}
 for record in font['name'].names:
  if record.nameID in names:record.string=names[record.nameID].encode(record.getEncoding())
 font.flavor='woff2';file=folder/('UnfoldingDisplay-'+style+'-Latin.woff2');font.save(file)
 registry['fonts'].append(dict(file=file.name,family='Unfolding Display',authors='Derived from Almendra by Ana Sanfelippo',canonicalSource='https://raw.githubusercontent.com/google/fonts/main/ofl/almendra/'+source.name,originalSha256=hashlib.sha256(source.read_bytes()).hexdigest(),bundledSha256=hashlib.sha256(file.read_bytes()).hexdigest(),bytes=file.stat().st_size,glyphCount=font['maxp'].numGlyphs,portugueseAccentsVerified=True,derivative='Latin WOFF2 subset renamed Unfolding Display to respect the original Reserved Font Name. No claim of a historical Steiner or institutional Waldorf typeface.'))
registry['updated']='2026-10-26';(folder/'font-sources.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
