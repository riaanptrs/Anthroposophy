/* Nutrition reading checks: local, unscored, no saved responses or network calls. */
(() => {
  for (const quiz of document.querySelectorAll('.nutrition-quiz')) {
    const choices = [...quiz.querySelectorAll('input[type="radio"]')];
    const feedback = quiz.querySelector('[data-nutrition-feedback]');
    const details = quiz.querySelector('details');
    const retry = quiz.querySelector('[data-nutrition-retry]');
    const reason = quiz.querySelector('[data-nutrition-reason]').textContent;
    quiz.querySelector('[data-nutrition-check]').addEventListener('click', () => {
      const selected = choices.findIndex(input => input.checked);
      if (selected < 0) {
        feedback.textContent = 'Choose an answer first, or open the explanation.';
        choices[0].focus();
        return;
      }
      const correct = selected === Number(quiz.dataset.answer);
      quiz.dataset.feedback = correct ? 'correct' : 'retry';
      feedback.textContent = (correct ? 'That matches the reading. ' : 'Revisit the passage. ') + reason;
      details.open = true;
      retry.hidden = false;
    });
    retry.addEventListener('click', () => {
      choices.forEach(input => { input.checked = false; });
      delete quiz.dataset.feedback;
      feedback.textContent = 'Try again when ready.';
      details.open = false;
      retry.hidden = true;
      choices[0].focus();
    });
  }
})();
