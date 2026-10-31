const STORAGE_KEY = 'zetor.lang';

export const LANGS = ['sv', 'en'];

const STRINGS = {
  sv: {
    'lang.name': 'SVENSKA',
    'title.sub': 'Den långa vägen hem',
    'title.year': 'April 1955',
    'title.play': 'SPELA',
    'title.lang': 'SPRÅK',
    'title.cheatOn': 'FUSK PÅ: alla avsnitt öppna',
    'title.cheatOff': 'FUSK AV',
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
    'ep1.intro': 'Våra hjältar sätter sig på motorcykeln och styr mot Vasa.',
    'ep1.howto': 'Styr undan för gropar, pölar och kor!',
    'ep1.km': 'Vasa {km} km',
    'ep1.smoke': 'Bakdäcket ryker!',
    'ep1.bang': 'PANG! Däcket är slut.',
    'ep2.howto': 'Vinka åt en bil med lediga platser! Bilar med väskor på taket är fulla.',
    'ep2.wave': 'VINKA!',
    'ep2.full': 'Fullt!',
    'ep2.stop': 'Hoppa in!',
    'ep2.sign': 'Flygfält 8 km',
    'ep2.early': 'Vänta tills bilen är här!',
    'ep3.howto': 'Flyg runt åskmolnen och fiskmåsarna!',
    'ep3.km': 'Helsingfors {km} km',
    'ep3.bump': 'Gupp!',
    'ep3.land': 'Landning i Helsingfors!',
    'ep4.howto': 'Följ de blå skyltarna till Hankkija!',
    'ep4.cross': 'Korsning {n} av {total}',
    'ep4.wrong': 'Fel väg! Vi vänder.',
    'ep4.arrive': 'Framme vid Hankkija!',
    'ep5.wait': 'Vänta! Vi ska hämta en Zetor!',
    'ep5.sigh': 'Nåja, kom in då.',
    'ep5.howto': 'Stämpla alla papper!',
    'ep5.stamp': 'STÄMPLA!',
    'ep5.paper': 'Papper {n} av {total}',
    'ep5.docs': ['Kvitto', 'Faktura', 'Registrering', 'Garanti'],
    'ep5.done': 'Klart! Zetorn är er.',
    'ep6.howto': 'Plocka tunnor och lådor till en sittplats!',
    'ep6.pick': 'PLOCKA!',
    'ep6.seat': 'Sittplats {n} av {total}',
    'ep6.comfy': 'Nu sitter jag bra!',
    'ep6.where': 'Var är min handske?!',
    'ep6.ask': 'FRÅGA CHAUFFÖREN',
    'ep6.driver': 'Jag körde förbi en handske på vägen en bit bakåt!',
    'ep6.back': 'Vi vänder och hämtar den!',
    'ep6.thanks': 'Där är den! Tack!',
    'ep6.missed': 'Missade! Vi försöker igen.',
    'ep7.howto': 'Fråga folk var man kan få mat!',
    'ep7.ask': 'FRÅGA',
    'ep7.busy': ['Ingen tid!', 'Jag är sen till jobbet!', 'Bussen går nu!', 'Förlåt, jag har bråttom!'],
    'ep7.hungry': 'Vi är så hungriga...',
    'ep7.found': 'Där är en butik!',
    'ep7.shop': 'Välj korv och bröd!',
    'ep7.wrong': 'Nej, korv och bröd!',
    'ep7.pay': 'Det blir 145 mark, tack!',
    'ep8.howto': 'Håll in HÄLL och släpp när kaffet når strecket!',
    'ep8.pour': 'HÄLL',
    'ep8.meter': 'Pigga',
    'ep8.spill': 'Hoppsan, det rann över!',
    'ep8.more': 'Lite mer, tack!',
    'ep8.awake': 'Nu är vi pigga igen!',
    'ep9.later': '26 timmar efter avfärden...',
    'ep9.home': 'HEMMA!',
    'ep9.woof': 'Vov!',
    'end.done': 'Avsnittet klart!',
    'end.bumps': 'Smällar: {n}',
    'end.next': 'FORTSÄTT',
    'end.again': 'SPELA IGEN',
    'ep2.title': 'Lift till flygfältet',
    'ep2.intro': 'Motorcykeln gav upp. Nu gäller det att få lift till Vasa flygfält.',
    'ep3.title': 'Flyget söderut',
    'ep3.intro': 'Upp i luften! Planet flyger söderut mot Helsingfors.',
    'ep4.title': 'Taxi till Hankkija',
    'ep4.intro': 'Från flygfältet tar de taxi till Hankkijas butik.',
    'ep5.title': 'Pappersarbete',
    'ep5.intro': 'Personalen är redan på väg hem... men vänder om och gör klart pappersarbetet.',
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
    'title.cheatOn': 'CHEAT ON: all episodes open',
    'title.cheatOff': 'CHEAT OFF',
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
    'ep1.howto': 'Steer around potholes, puddles and cows!',
    'ep1.km': 'Vaasa {km} km',
    'ep1.smoke': 'The back tyre is smoking!',
    'ep1.bang': 'BANG! The tyre is done for.',
    'ep2.howto': 'Wave at a car with free seats! Cars with suitcases on the roof are full.',
    'ep2.wave': 'WAVE!',
    'ep2.full': 'Full!',
    'ep2.stop': 'Hop in!',
    'ep2.sign': 'Airport 8 km',
    'ep2.early': 'Wait until the car is here!',
    'ep3.howto': 'Fly around the thunderclouds and the gulls!',
    'ep3.km': 'Helsinki {km} km',
    'ep3.bump': 'Bump!',
    'ep3.land': 'Landing in Helsinki!',
    'ep4.howto': 'Follow the blue signs to Hankkija!',
    'ep4.cross': 'Crossing {n} of {total}',
    'ep4.wrong': 'Wrong way! Turning back.',
    'ep4.arrive': 'Here at Hankkija!',
    'ep5.wait': 'Wait! We are here for a Zetor!',
    'ep5.sigh': 'Oh well, come in then.',
    'ep5.howto': 'Stamp all the papers!',
    'ep5.stamp': 'STAMP!',
    'ep5.paper': 'Paper {n} of {total}',
    'ep5.docs': ['Receipt', 'Invoice', 'Registration', 'Warranty'],
    'ep5.done': 'Done! The Zetor is yours.',
    'ep6.howto': 'Pick up barrels and boxes to build a seat!',
    'ep6.pick': 'PICK UP!',
    'ep6.seat': 'Seat {n} of {total}',
    'ep6.comfy': "Now I'm comfy!",
    'ep6.where': 'Where is my glove?!',
    'ep6.ask': 'ASK THE DRIVER',
    'ep6.driver': 'I drove past a glove on the road back there!',
    'ep6.back': "Let's turn around and get it!",
    'ep6.thanks': 'There it is! Thanks!',
    'ep6.missed': 'Missed it! Try again.',
    'ep7.howto': 'Ask people where to get food!',
    'ep7.ask': 'ASK',
    'ep7.busy': ['No time!', "I'm late for work!", 'My bus is leaving!', "Sorry, I'm in a hurry!"],
    'ep7.hungry': 'We are so hungry...',
    'ep7.found': "There's a shop!",
    'ep7.shop': 'Pick the sausage and the bread!',
    'ep7.wrong': 'No, sausage and bread!',
    'ep7.pay': "That's 145 marks, please!",
    'ep8.howto': 'Hold POUR and let go when the coffee reaches the line!',
    'ep8.pour': 'POUR',
    'ep8.meter': 'Awake',
    'ep8.spill': 'Oops, it spilled over!',
    'ep8.more': 'A bit more, please!',
    'ep8.awake': "Now we're wide awake!",
    'ep9.later': '26 hours after setting off...',
    'ep9.home': 'HOME!',
    'ep9.woof': 'Woof!',
    'end.done': 'Episode complete!',
    'end.bumps': 'Bumps: {n}',
    'end.next': 'CONTINUE',
    'end.again': 'PLAY AGAIN',
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
    // Storage unavailable; start in Swedish.
  }
  // Swedish is the default; English is one tap away on the title screen.
  return 'sv';
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

// Look up a string; `{name}` placeholders are filled from `vars`.
export function t(key, vars) {
  const str = STRINGS[current][key] ?? STRINGS.en[key] ?? key;
  if (!vars || typeof str !== 'string') return str;
  return str.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m));
}

document.documentElement.lang = current;
