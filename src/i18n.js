const STORAGE_KEY = 'zetor.lang';

export const LANGS = ['sv', 'en'];

const STRINGS = {
  sv: {
    'lang.name': 'SVENSKA',
    'title.sub': 'Den långa vägen hem',
    'title.year': 'April 1955',
    'title.play': 'SPELA',
    'title.lang': 'SPRÅK',
    'select.heading': 'AVSNITT',
    'select.locked': 'Spela föregående avsnitt först',
    'common.back': 'TILLBAKA',
    'common.episode': 'AVSNITT',
    'common.tap': 'Tryck för att fortsätta',
    'common.menu': 'TILL MENYN',
    'placeholder.soon': 'Kommer snart!',
    'placeholder.try': 'Prova kontrollerna:',
    'placeholder.skip': 'HOPPA ÖVER',
    'prologue':
      'April 1955. Två män från Österbotten ska hämta en ny Zetor 25A i Helsingfors.\n\nMen tågen står still. Det är strejk!',
    'ep1.title': 'Mot Vasa',
    'ep1.intro': 'Våra hjältar klämmer in sig på en enda motorcykel och styr mot Vasa.',
    'ep2.title': 'Lift till flygfältet',
    'ep2.intro': 'Motorcykeln gav upp. Nu gäller det att få lift till Vasa flygfält.',
    'ep3.title': 'Flyget söderut',
    'ep3.intro': 'Upp i luften! Planet flyger söderut mot Helsingfors.',
    'ep4.title': 'Taxi till Hankkija',
    'ep4.intro': 'Från flygfältet tar de taxi till Hankkijas butik.',
    'ep5.title': 'Pappersarbete',
    'ep5.intro': 'Personalen är redan på väg hem... men vänder om och gör klart pappren.',
    'ep6.title': 'Zetorn kör hemåt',
    'ep6.intro': 'Nu bär det av hemåt på den nya Zetorn! Den ena kör. Den andra behöver något att sitta på.',
    'ep7.title': 'Frukost i Björneborg',
    'ep7.intro': 'Morgon i Björneborg. Alla har bråttom till jobbet, men våra hjältar är hungriga.',
    'ep8.title': 'Kaffepaus',
    'ep8.intro': 'Norr om Björneborg finns ett kafé. Nu behövs kaffe. Mycket kaffe!',
    'ep9.title': 'Hemma igen',
    'ep9.intro': 'Äntligen hemma!',
    'credits.lines': [
      'HEMMA!',
      '',
      'Resan tog',
      '26 TIMMAR',
      '',
      'Österbotten – Helsingfors',
      'och hem igen med',
      'motorcykel, bil, flyg,',
      'taxi och en Zetor 25A.',
      '',
      'Baserat på en sann',
      'historia, april 1955.',
      '',
      'Tack för att du spelade!',
    ],
  },
  en: {
    'lang.name': 'ENGLISH',
    'title.sub': 'The long road home',
    'title.year': 'April 1955',
    'title.play': 'PLAY',
    'title.lang': 'LANGUAGE',
    'select.heading': 'EPISODES',
    'select.locked': 'Play the previous episode first',
    'common.back': 'BACK',
    'common.episode': 'EPISODE',
    'common.tap': 'Tap to continue',
    'common.menu': 'MENU',
    'placeholder.soon': 'Coming soon!',
    'placeholder.try': 'Try the controls:',
    'placeholder.skip': 'SKIP',
    'prologue':
      'April 1955. Two men from Ostrobothnia must fetch a new Zetor 25A from Helsinki.\n\nBut the trains have stopped. There is a strike!',
    'ep1.title': 'To Vaasa',
    'ep1.intro': 'Our heroes squeeze onto a single motorcycle and head for Vaasa.',
    'ep2.title': 'A lift to the airport',
    'ep2.intro': 'The motorcycle gave up. Time to catch a lift to Vaasa airport.',
    'ep3.title': 'Flying south',
    'ep3.intro': 'Up in the air! The plane flies south to Helsinki.',
    'ep4.title': 'Taxi to Hankkija',
    'ep4.intro': 'From the airport they take a taxi to the Hankkija store.',
    'ep5.title': 'Paperwork',
    'ep5.intro': 'The staff are already on their way home... but they go back in and finish the paperwork.',
    'ep6.title': 'Heading home',
    'ep6.intro': 'Off home on the new Zetor! One of them drives. The other needs something to sit on.',
    'ep7.title': 'Björneborg breakfast',
    'ep7.intro': 'Morning in Björneborg. Everyone is rushing to work, but our heroes are hungry.',
    'ep8.title': 'Coffee stop',
    'ep8.intro': 'North of Björneborg there is a café. Time for coffee. Lots of coffee!',
    'ep9.title': 'Home at last',
    'ep9.intro': 'Home at last!',
    'credits.lines': [
      'HOME!',
      '',
      'The trip took',
      '26 HOURS',
      '',
      'Ostrobothnia – Helsinki',
      'and back home by',
      'motorcycle, car, plane,',
      'taxi and a Zetor 25A.',
      '',
      'Based on a true story,',
      'April 1955.',
      '',
      'Thanks for playing!',
    ],
  },
};

function detect() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch (e) {
    // Storage unavailable; fall through to the browser language.
  }
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('en') ? 'en' : 'sv';
}

let current = detect();

export function lang() {
  return current;
}

export function setLang(code) {
  if (!LANGS.includes(code)) return;
  current = code;
  document.documentElement.lang = code;
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch (e) {
    // Not saved; the choice still applies for this visit.
  }
}

export function nextLang() {
  setLang(LANGS[(LANGS.indexOf(current) + 1) % LANGS.length]);
}

export function t(key) {
  return STRINGS[current][key] ?? STRINGS.en[key] ?? key;
}

document.documentElement.lang = current;
