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
    if (branchDetailBox) branchDetailBox.innerHTML = branchDetails[button.dataset.detail];
  });
});

const simulationContent = document.querySelector('#simulation-content');
const restartButton = document.querySelector('#restart-simulator');
const progressTrack = document.querySelector('.progress-track');
const totalSteps = 7;
let simulationStep = 1;
let proposalName = '';
let houseVersion = 'מקורי';
let senateVersion = 'מקורי';

if (progressTrack) {
  progressTrack.innerHTML = Array.from({ length: totalSteps }, (_, index) => {
    const step = `<span class="progress-step">${index + 1}</span>`;
    return index < totalSteps - 1 ? `${step}<span class="progress-line"></span>` : step;
  }).join('');
  progressTrack.setAttribute('aria-label', 'התקדמות בסימולטור — שבעה שלבים');
}

const simulatorStyle = document.createElement('style');
simulatorStyle.textContent = `
  .simulation-note{margin-top:1rem;padding:.85rem 1rem;border-right:3px solid var(--gold-bright);background:rgba(215,173,88,.07);border-radius:10px;color:var(--muted)}
  .vote-summary{display:grid;grid-template-columns:repeat(2,1fr);gap:.8rem;margin:1.2rem 0}
  .vote-summary div{padding:.9rem;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px}
  .vote-summary strong{display:block;color:var(--gold-bright)}
  @media(max-width:640px){.simulator-card{padding:1.15rem}.progress-step{width:29px;height:29px;font-size:.78rem}.progress-track{margin-bottom:1.5rem}.vote-summary{grid-template-columns:1fr}.simulation-content h3{font-size:1.4rem}}
`;
document.head.appendChild(simulatorStyle);

function getProgressSteps() {
  return [...document.querySelectorAll('.progress-step')];
}

function getProgressLines() {
  return [...document.querySelectorAll('.progress-line')];
}

function updateProgress(step) {
  getProgressSteps().forEach((item, index) => {
    item.classList.toggle('active', index === step - 1);
    item.classList.toggle('done', index < step - 1);
  });
  getProgressLines().forEach((line, index) => {
    line.classList.toggle('done', index < step - 1);
  });
}

function badge() {
  return `<span class="result-badge">שלב ${simulationStep} מתוך ${totalSteps}</span>`;
}

function renderStepOne() {
  simulationStep = 1;
  proposalName = '';
  houseVersion = 'מקורי';
  senateVersion = 'מקורי';
  updateProgress(1);
  simulationContent.innerHTML = `
    ${badge()}
    <h3>בחרו הצעת חוק</h3>
    <p>כל הצעת חוק מתחילה כרעיון. בחרו נושא, ולאחר מכן נסו להעביר אותו בכל תחנות החקיקה.</p>
    <div class="choice-list">
      <button type="button" data-proposal="חוק לשימור פארקים לאומיים">חוק לשימור פארקים לאומיים</button>
      <button type="button" data-proposal="חוק להרחבת ספריות ציבוריות">חוק להרחבת ספריות ציבוריות</button>
      <button type="button" data-proposal="חוק לשיפור תשתיות תחבורה">חוק לשיפור תשתיות תחבורה</button>
    </div>`;

  simulationContent.querySelectorAll('[data-proposal]').forEach((button) => {
    button.addEventListener('click', () => {
      proposalName = button.dataset.proposal;
      renderCommittee();
    });
  });
}

function renderCommittee() {
  simulationStep = 2;
  updateProgress(2);
  simulationContent.innerHTML = `
    ${badge()}
    <h3>בדיקה בוועדת הקונגרס</h3>
    <p>“${proposalName}” הועברה לוועדה מקצועית. חברי הוועדה בוחנים את העלות, שומעים מומחים ומחליטים אם לקדם אותה.</p>
    <div class="choice-list">
      <button type="button" data-committee="revise">לקבל תיקונים מקצועיים ולהעביר להצבעה</button>
      <button type="button" data-committee="rush">לדחות את התיקונים ולדרוש הצבעה מידית</button>
      <button type="button" data-committee="table">להשאיר את ההצעה בוועדה ללא הצבעה</button>
    </div>
    <p class="simulation-note"><strong>חשוב לדעת:</strong> הצעות רבות נעצרות כבר בוועדה ואינן מגיעות למליאת הקונגרס.</p>`;

  simulationContent.querySelector('[data-committee="revise"]').addEventListener('click', () => {
    houseVersion = 'מתוקן בוועדה';
    renderHouse();
  });
  simulationContent.querySelector('[data-committee="rush"]').addEventListener('click', () => renderEnding(false, 'הוועדה לא השתכנעה שההצעה מוכנה להצבעה, ולכן היא נעצרה בשלב הוועדה.', 2));
  simulationContent.querySelector('[data-committee="table"]').addEventListener('click', () => renderEnding(false, 'הוועדה הניחה את ההצעה בצד. ללא החלטה לקדם אותה, הליך החקיקה נעצר.', 2));
}

function renderHouse() {
  simulationStep = 3;
  updateProgress(3);
  simulationContent.innerHTML = `
    ${badge()}
    <h3>הצבעה בבית הנבחרים</h3>
    <p>ההצעה המתוקנת מגיעה למליאת בית הנבחרים. כדי לעבור נדרש רוב רגיל מן המשתתפים בהצבעה.</p>
    <div class="choice-list">
      <button type="button" data-house="coalition">לבנות קואליציה ולהעביר את ההצעה</button>
      <button type="button" data-house="narrow">להסתמך על תמיכה צרה ללא פשרות נוספות</button>
    </div>`;

  simulationContent.querySelector('[data-house="coalition"]').addEventListener('click', renderSenate);
  simulationContent.querySelector('[data-house="narrow"]').addEventListener('click', () => renderEnding(false, 'ההצעה לא קיבלה רוב בבית הנבחרים ולכן אינה יכולה להתקדם לסנאט.', 3));
}

function renderSenate() {
  simulationStep = 4;
  updateProgress(4);
  simulationContent.innerHTML = `
    ${badge()}
    <h3>דיון והצבעה בסנאט</h3>
    <p>לאחר שעברה בבית הנבחרים, “${proposalName}” מגיעה לסנאט. הסנאטורים יכולים לאשר את אותו נוסח או לשנות אותו.</p>
    <div class="choice-list">
      <button type="button" data-senate="same">לאשר את נוסח בית הנבחרים</button>
      <button type="button" data-senate="amend">לאשר נוסח שונה עם תיקון נוסף</button>
      <button type="button" data-senate="fail">לדחות את ההצעה</button>
    </div>`;

  simulationContent.querySelector('[data-senate="same"]').addEventListener('click', () => {
    senateVersion = houseVersion;
    renderPresident();
  });
  simulationContent.querySelector('[data-senate="amend"]').addEventListener('click', () => {
    senateVersion = 'מתוקן בסנאט';
    renderConference();
  });
  simulationContent.querySelector('[data-senate="fail"]').addEventListener('click', () => renderEnding(false, 'הסנאט דחה את ההצעה. אישור של בית אחד בלבד אינו מספיק.', 4));
}

function renderConference() {
  simulationStep = 5;
  updateProgress(5);
  simulationContent.innerHTML = `
    ${badge()}
    <h3>ועדת ועידה: מאחדים את הנוסחים</h3>
    <p>בית הנבחרים והסנאט אישרו נוסחים שונים. ועדה משותפת צריכה להכין נוסח מוסכם, ולאחר מכן שני הבתים חייבים לאשר אותו שוב.</p>
    <div class="vote-summary">
      <div><strong>נוסח בית הנבחרים</strong>${houseVersion}</div>
      <div><strong>נוסח הסנאט</strong>${senateVersion}</div>
    </div>
    <div class="choice-list">
      <button type="button" data-conference="compromise">לגבש נוסח פשרה ששני הבתים יאשרו</button>
      <button type="button" data-conference="collapse">להתעקש על אחד הנוסחים בלבד</button>
    </div>`;

  simulationContent.querySelector('[data-conference="compromise"]').addEventListener('click', renderPresident);
  simulationContent.querySelector('[data-conference="collapse"]').addEventListener('click', () => renderEnding(false, 'הבתים לא הצליחו להסכים על נוסח זהה, ולכן ההצעה לא יכולה להישלח לנשיא.', 5));
}

function renderPresident() {
  simulationStep = 6;
  updateProgress(6);
  simulationContent.innerHTML = `
    ${badge()}
    <h3>ההצעה מגיעה לנשיא</h3>
    <p>שני בתי הקונגרס אישרו נוסח זהה של “${proposalName}”. כעת הנשיא יכול לחתום עליה או להטיל וטו.</p>
    <div class="choice-list">
      <button type="button" data-president="sign">הנשיא חותם על ההצעה</button>
      <button type="button" data-president="veto">הנשיא מטיל וטו ומחזיר אותה לקונגרס</button>
    </div>`;

  simulationContent.querySelector('[data-president="sign"]').addEventListener('click', () => renderEnding(true, 'הנשיא חתם על ההצעה והיא הפכה לחוק. הרשות המבצעת אחראית כעת ליישומה.', 7));
  simulationContent.querySelector('[data-president="veto"]').addEventListener('click', renderOverride);
}

function renderOverride() {
  simulationStep = 7;
  updateProgress(7);
  simulationContent.innerHTML = `
    ${badge()}
    <h3>ניסיון להתגבר על הווטו</h3>
    <p>כדי להתגבר על וטו נשיאותי נדרש רוב של שני שלישים בבית הנבחרים וגם רוב של שני שלישים בסנאט.</p>
    <div class="choice-list">
      <button type="button" data-override="yes">לבנות קואליציה רחבה ולהשיג שני שלישים בשני הבתים</button>
      <button type="button" data-override="house-only">להשיג שני שלישים רק בבית הנבחרים</button>
      <button type="button" data-override="no">לוותר על ניסיון ההתגברות</button>
    </div>`;

  simulationContent.querySelector('[data-override="yes"]').addEventListener('click', () => renderEnding(true, 'הקונגרס השיג רוב של שני שלישים בשני הבתים והתגבר על הווטו. ההצעה הפכה לחוק גם ללא חתימת הנשיא.', 7));
  simulationContent.querySelector('[data-override="house-only"]').addEventListener('click', () => renderEnding(false, 'רוב של שני שלישים בבית אחד בלבד אינו מספיק. הווטו נשאר בתוקף.', 7));
  simulationContent.querySelector('[data-override="no"]').addEventListener('click', () => renderEnding(false, 'הקונגרס לא ניסה להתגבר על הווטו, ולכן הצעת החוק לא התקבלה.', 7));
}

function renderEnding(success, explanation, finalStep) {
  simulationStep = Math.min(finalStep, totalSteps);
  updateProgress(simulationStep);
  simulationContent.innerHTML = `
    <span class="result-badge">${success ? 'החוק התקבל' : 'התהליך נעצר'}</span>
    <h3>${success ? 'הצלחתם להעביר את הצעת החוק' : 'הצעת החוק לא עברה הפעם'}</h3>
    <p>${explanation}</p>
    <p><strong>מה למדנו?</strong> הצעת חוק צריכה לעבור ועדה, לקבל אישור בשני בתי הקונגרס בנוסח זהה, ולעבור את שלב הנשיא. כל תחנה יכולה לשנות את התוצאה.</p>
    <button id="play-again" class="button primary" type="button">לנסות מסלול חדש</button>`;
  simulationContent.querySelector('#play-again').addEventListener('click', renderStepOne);
}

restartButton?.addEventListener('click', renderStepOne);
if (simulationContent) renderStepOne();

const quizFeedback = document.querySelector('#quiz-feedback');
document.querySelectorAll('.quiz-options button').forEach((button) => {
  button.addEventListener('click', () => {
    const correct = button.dataset.answer === 'correct';
    if (quizFeedback) {
      quizFeedback.textContent = correct
        ? 'נכון! הקונגרס הוא הרשות המחוקקת והוא מורכב משני בתים.'
        : 'לא בדיוק. התשובה הנכונה היא הרשות המחוקקת.';
    }
  });
});
