const menuButton = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('.main-nav');

if (menuButton && mainNavigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'פתיחת תפריט הניווט' : 'סגירת תפריט הניווט');
    menuButton.classList.toggle('open', !isOpen);
    mainNavigation.classList.toggle('open', !isOpen);
  });

  mainNavigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'פתיחת תפריט הניווט');
      menuButton.classList.remove('open');
      mainNavigation.classList.remove('open');
    });
  });
}

const branchDetails = {
  congress: '<strong>הקונגרס:</strong> מחוקק חוקים, מאשר תקציבים, מפקח על הרשות המבצעת ויכול להתגבר על וטו נשיאותי ברוב המוגדר בחוקה.',
  executive: '<strong>הנשיא:</strong> מבצע את החוקים, ממנה בעלי תפקידים בכפוף להליכי אישור, מנהל את הרשות המבצעת ויכול להטיל וטו על הצעת חוק.',
  judiciary: '<strong>בתי המשפט:</strong> מכריעים בסכסוכים משפטיים ומפרשים את החוקה והחוקים במסגרת תיקים המובאים בפניהם.'
};

const branchDetailBox = document.querySelector('#branch-detail');
document.querySelectorAll('.detail-button').forEach((button) => {
  button.addEventListener('click', () => {
    branchDetailBox.innerHTML = branchDetails[button.dataset.detail];
  });
});

const simulationContent = document.querySelector('#simulation-content');
const restartButton = document.querySelector('#restart-simulator');
const progressSteps = [...document.querySelectorAll('.progress-step')];
const progressLines = [...document.querySelectorAll('.progress-line')];
let simulationStep = 1;
let proposalName = '';

function updateProgress(step) {
  progressSteps.forEach((item, index) => {
    item.classList.toggle('active', index === step - 1);
    item.classList.toggle('done', index < step - 1);
  });
  progressLines.forEach((line, index) => {
    line.classList.toggle('done', index < step - 1);
  });
}

function renderStepOne() {
  simulationStep = 1;
  updateProgress(1);
  simulationContent.innerHTML = `
    <span class="result-badge">שלב 1 מתוך 4</span>
    <h3>בחרו הצעת חוק</h3>
    <p>ההצעה תתחיל את דרכה בקונגרס. בחרו נושא כדי להתחיל.</p>
    <div class="choice-list">
      <button type="button" data-proposal="חוק לשימור פארקים לאומיים">חוק לשימור פארקים לאומיים</button>
      <button type="button" data-proposal="חוק להרחבת ספריות ציבוריות">חוק להרחבת ספריות ציבוריות</button>
      <button type="button" data-proposal="חוק לשיפור תשתיות תחבורה">חוק לשיפור תשתיות תחבורה</button>
    </div>`;

  simulationContent.querySelectorAll('[data-proposal]').forEach((button) => {
    button.addEventListener('click', () => {
      proposalName = button.dataset.proposal;
      renderStepTwo();
    });
  });
}

function renderStepTwo() {
  simulationStep = 2;
  updateProgress(2);
  simulationContent.innerHTML = `
    <span class="result-badge">שלב 2 מתוך 4</span>
    <h3>דיון והצבעה בקונגרס</h3>
    <p>הצעתכם, “${proposalName}”, נידונה בוועדות ולאחר מכן מובאת להצבעה. מה תרצו לעשות?</p>
    <div class="choice-list">
      <button type="button" data-congress="approve">לגבש פשרה כדי לזכות בתמיכת שני הבתים</button>
      <button type="button" data-congress="fail">להתעקש על הנוסח המקורי ללא פשרות</button>
    </div>`;

  simulationContent.querySelector('[data-congress="approve"]').addEventListener('click', renderStepThree);
  simulationContent.querySelector('[data-congress="fail"]').addEventListener('click', () => renderEnding(false, 'ההצעה לא השיגה תמיכה מספקת בקונגרס ולכן נעצרה לפני שהגיעה לנשיא.'));
}

function renderStepThree() {
  simulationStep = 3;
  updateProgress(3);
  simulationContent.innerHTML = `
    <span class="result-badge">שלב 3 מתוך 4</span>
    <h3>ההצעה מגיעה לנשיא</h3>
    <p>שני בתי הקונגרס אישרו את “${proposalName}”. הנשיא שוקל אם לחתום עליה או להטיל וטו.</p>
    <div class="choice-list">
      <button type="button" data-president="sign">הנשיא חותם על ההצעה</button>
      <button type="button" data-president="veto">הנשיא מטיל וטו</button>
    </div>`;

  simulationContent.querySelector('[data-president="sign"]').addEventListener('click', () => renderEnding(true, 'הנשיא חתם על ההצעה והיא הפכה לחוק. כעת הרשות המבצעת אחראית ליישומה.'));
  simulationContent.querySelector('[data-president="veto"]').addEventListener('click', renderStepFour);
}

function renderStepFour() {
  simulationStep = 4;
  updateProgress(4);
  simulationContent.innerHTML = `
    <span class="result-badge">שלב 4 מתוך 4</span>
    <h3>האם הקונגרס יתגבר על הווטו?</h3>
    <p>ההצעה חזרה לקונגרס. כדי להתגבר על הווטו נדרש רוב של שני שלישים בכל אחד משני הבתים.</p>
    <div class="choice-list">
      <button type="button" data-override="yes">לבנות קואליציה רחבה ולהשיג שני שלישים</button>
      <button type="button" data-override="no">לוותר על ניסיון ההתגברות</button>
    </div>`;

  simulationContent.querySelector('[data-override="yes"]').addEventListener('click', () => renderEnding(true, 'הקונגרס השיג את הרוב הדרוש בשני הבתים והתגבר על הווטו. ההצעה הפכה לחוק.'));
  simulationContent.querySelector('[data-override="no"]').addEventListener('click', () => renderEnding(false, 'הווטו נשאר בתוקף והצעת החוק לא התקבלה. ניתן לנסח הצעה חדשה ולנסות שוב.'));
}

function renderEnding(success, explanation) {
  simulationStep = 4;
  updateProgress(4);
  simulationContent.innerHTML = `
    <span class="result-badge">${success ? 'החוק התקבל' : 'התהליך נעצר'}</span>
    <h3>${success ? 'הצלחתם להעביר את הצעת החוק' : 'הצעת החוק לא עברה הפעם'}</h3>
    <p>${explanation}</p>
    <p><strong>מה למדנו?</strong> לכל רשות תפקיד משלה, והליך החקיקה נועד לחייב דיון, הסכמה ובקרה בין מוקדי הכוח.</p>
    <button id="play-again" class="button primary" type="button">לשחק שוב</button>`;
  simulationContent.querySelector('#play-again').addEventListener('click', renderStepOne);
}

restartButton?.addEventListener('click', renderStepOne);
if (simulationContent) renderStepOne();

const quizFeedback = document.querySelector('#quiz-feedback');
document.querySelectorAll('.quiz-options button').forEach((button) => {
  button.addEventListener('click', () => {
    const correct = button.dataset.answer === 'correct';
    quizFeedback.textContent = correct
      ? 'נכון! הקונגרס הוא הרשות המחוקקת והוא מורכב משני בתים.'
      : 'לא בדיוק. התשובה הנכונה היא הרשות המחוקקת.';
  });
});
