/* Georgian presentation strings. Internal scene IDs, save keys and key codes stay stable. */
const GameGeorgian = (() => {
 const phrases = `
THE SUNKEN AQUEDUCT|ჩაძირული აკვედუკი
Recover the three floodgate stones|შეაგროვე წყალსაკეტის სამი ქვა
ROOT STAIRWELL|ფესვების კიბე
LOWER WATER GALLERY|ქვედა წყლის გალერეა
THE WINDWARD SUMMITS|ქარიანი მწვერვალები
Land on the three summit flags|დაეშვი სამივე მწვერვალის დროშასთან
THE FREIGHT REBELLION|აჯანყება სატვირთო სადგურზე
Shoot three power relays to break the blockade|ესროლე სამ ენერგორელეს და გაარღვიე ბლოკადა
DRAINAGE STAIRS|სადრენაჟო კიბე
ARMORED SERVICE VAULT|ჯავშნიანი ტექნიკური საცავი
THE SPIRAL ORE SHAFT|სპირალური საბადო
Defeat each mine foreman, then recover the ore|დაამარცხე სამივე მაღაროს ზედამხედველი და აიღე მადანი
FIRST DESCENT|პირველი ჩასვლა
DEEP ORE STAIRS|ღრმა საბადოს კიბე
THE RETURN SHAFT|ამოსასვლელი შახტი
THE BASALT SKY FORGE|ბაზალტის ციური სამჭედლო
Turn three cooling wheels: crouch beside each wheel|მოატრიალე სამი გამაგრილებელი ბორბალი: თითოეულთან ჩაიკუზე
DOWNSTAIRS TO THE COOLING FORGE|კიბით გამაგრილებელ სამჭედლოში
THE LIGHTHOUSE SWITCHBACK|შუქურის დაკლაკნილი ბილიკი
Ignite the beacons in order, then face the World Eater|თანმიმდევრობით აანთე შუქურები და შეებრძოლე სამყაროთა მჭამელს
DESCEND THROUGH THE SEA CRYPT|ჩადი ზღვის საძვალეში
Follow the marked stairs and arrows.|მიჰყევი მონიშნულ კიბეებსა და ისრებს.
RELAY DISABLED|რელე გათიშულია
CLEAR MINERS|დაამარცხე მაღაროელები
THE WORKSHOP|სახელოსნო
Equipment for the next journey.|მოემზადე შემდეგი თავგადასავლისთვის.
Collect coins. Exchange them for shop tokens.|შეაგროვე მონეტები და გადაცვალე მაღაზიის ჟეტონებში.
Scroll to browse the full collection.|მთელი კოლექციის სანახავად გადაახვიე.
PROMO CODE|პრომოკოდი
Daily bonus collected:|დღიური საჩუქარი მიღებულია:
DAILY FIELD NOTES|დღიური დავალებები
Eight new tasks each day. Follow a trail, earn a reward.|ყოველდღე რვა ახალი დავალება. შეასრულე და მიიღე ჯილდო.
IN PROGRESS|მიმდინარეობს
Complete any six tasks for a daily bonus.|დღიური საჩუქრისთვის შეასრულე ნებისმიერი ექვსი დავალება.
BONUS COLLECTED|საჩუქარი მიღებულია
WORKSHOP / PREVIEW|სახელოსნო / დათვალიერება
TEST FIRE|სატესტო სროლა
PERMANENT UPGRADE|მუდმივი გაუმჯობესება
CHARACTER OUTFIT|პერსონაჟის გარეგნობა
STARTING WEAPON|საწყისი იარაღი
Buy once. Keep the skill for every journey.|შეიძინე ერთხელ და გამოიყენე ყველა თავგადასავალში.
Choose your character before heading out.|გამგზავრებამდე აირჩიე პერსონაჟი.
Equip this weapon for your next level.|შემდეგი დონისთვის აღიჭურვე ამ იარაღით.
THE WORLD EATER|სამყაროთა მჭამელი
FERN VALLEY|გვიმრების ხეობა
THE BROKEN AQUEDUCT|დანგრეული აკვედუკი
OLD STONE MILL|ძველი ქვის წისქვილი
CANOPY CROSSING|გადასასვლელი ხის კენწეროებზე
THE SUNKEN TEMPLE|ჩაძირული ტაძარი
THE LAST WATCH|უკანასკნელი საგუშაგო
STONE MILL|ქვის წისქვილი
TEMPLE DOOR|ტაძრის კარი
THE WIND ARCHIVE|ქარის არქივი
BROKEN CAUSEWAY|დანგრეული გადასასვლელი
THE CLOCK GALLERY|საათის გალერეა
CLOUD FERRY|ღრუბლების ბორანი
THE BELL TOWERS|სამრეკლოები
HOMEWARD BRIDGE|შინისკენ მიმავალი ხიდი
THE WEST BELL|დასავლეთის ზარი
NIGHT MARKET|ღამის ბაზარი
THE LOADING DOCK|სატვირთო დოკი
ROOFTOP SERVICE ROAD|სახურავის ტექნიკური ბილიკი
POWER STATION|ელექტროსადგური
THE SIGNAL BRIDGE|სასიგნალო ხიდი
LAST TRAIN HOME|უკანასკნელი მატარებელი შინ
RADIO TBILISI|რადიო თბილისი
LOADING BAY 07|სატვირთო მოედანი 07
NORTH PLATFORM|ჩრდილოეთის ბაქანი
THE LANTERN SHAFT|ფარნების შახტი
ROPE BRIDGE|თოკის ხიდი
THE CUTTING ROOM|საჭრელი ოთახი
CRYSTAL GALLERY|კრისტალების გალერეა
FALLING STONE|ჩამოცვენილი ქვები
THE OLD EXIT|ძველი გასასვლელი
SHAFT 03|შახტი 03
CUTTING ROOM|საჭრელი ოთახი
UNSTABLE ROOF|არამყარი ჭერი
THE ASH ROAD|ფერფლის გზა
CINDER CHANNEL|ნაკვერჩხლების არხი
THE FORGE|სამჭედლო
STEAM FERRY|ორთქლის ბორანი
CRATER RIDGE|კრატერის ქედი
THE OBSIDIAN DOOR|ობსიდიანის კარი
THE OLD FORGE|ძველი სამჭედლო
CRATER STATION|კრატერის სადგური
THE QUIET APPROACH|მშვიდი მისადგომი
FIRST SEAL|პირველი ბეჭედი
THE RESONANCE HALL|რეზონანსის დარბაზი
LAST WATCHPOINT|უკანასკნელი საგუშაგო
LAST WATCH|უკანასკნელი საგუშაგო
THE LIGHTHOUSE|შუქურა
GATE OPEN|კარი ღიაა
PLASMA + SUPPLIES|პლაზმა და მარაგი
SHIELD READY|ფარი მზადაა
HEALTH +1|სიცოცხლე +1
JUMP / SPACE TO RELEASE THE ROPE|თოკის გასაშვებად დააჭირე გამოტოვებას
MOVE  ← →    JUMP  SPACE    DUCK  ↓    FIRE  F    RUN  SHIFT|მოძრაობა ← →   ნახტომი Space   ჩაკუზვა ↓   სროლა F   სირბილი Shift
BONUS BRIDGE|ბონუსის ხიდი
SECRET CACHE|საიდუმლო სამალავი
VINE SWEEP — DUCK|ლიანის მოქნევა — ჩაიკუზე
BELL WAVE — JUMP|ზარის ტალღა — ახტი
FREIGHT TRAIN — HIGH ROUTE|სატვირთო მატარებელი — ადი ზედა ბილიკზე
POWER JUNCTION|ენერგიის კვანძი
DRILL — WAIT IN THE POCKET|ბურღი — მოიცადე ნიშაში
LAVA TIDE — HIGH LEDGE|ლავა იმატებს — ადი მაღალ კიდეზე
LENS RECEIVER — JUMP|ლინზის მიმღები — ახტი
OPEN BOTH SEALS TO ENTER|შესასვლელად გახსენი ორივე ბეჭედი
WEIGHT TILTS THE STONE|სიმძიმე ქვას ხრის
FLOW RISING|ნაკადი იმატებს
WATCH THE WATER|დააკვირდი წყალს
ANCHOR DISABLED|სამაგრი გათიშულია
DUCK / SHOOT ANCHOR|ჩაიკუზე / ესროლე სამაგრს
BOARD LOW · RIDE UP|შედექი დაბლა · აჰყევი მაღლა
BELL WINDING · JUMP|ზარი ირხევა · ახტი
BELL CROSSING|გადასასვლელი ზართან
WEIGHT MOVES BOTH LIFTS|სიმძიმე ორივე ამწეს ამოძრავებს
TRAIN COMING · TAKE COVER|მატარებელი მოდის · შეეფარე
FREIGHT CROSSING|სატვირთო გადასასვლელი
RIDE THE CONTAINER|აჰყევი კონტეინერს
SHOOT / TOUCH TO ROUTE POWER|ენერგიის გადასართავად ესროლე ან შეეხე
RIDE THE ORE BUCKET|გაჰყევი მადნის ვედროს
DUST MEANS DANGER|მტვერი საფრთხის ნიშანია
CRACKING · KEEP MOVING|იბზარება · განაგრძე მოძრაობა
HIGH WATER MARK|წყლის მაქსიმალური დონე
COOL → GLOW → SINK|გრილდება → ცხელდება → იძირება
TURN VALVE / SHOOT|მოატრიალე სარქველი / ესროლე
RECEIVER CHARGING|მიმღები იტენება
LENS → RECEIVER → FLOOR|ლინზა → მიმღები → იატაკი
WATCH THE FOUR BEAT MARKS|დააკვირდი ოთხ ტაქტს
SEAL OPEN|ბეჭედი გახსნილია
ACTIVATE SEAL|გაააქტიურე ბეჭედი
ZOMBIE CHARGE|ზომბის იერიში
CINDER FOOTPRINTS — JUMP|ცეცხლოვანი ნაკვალევი — ახტი
HOP OVER|გადაახტი
MUD · JUMP|ტალახი · ახტი
ICE · BRAKE EARLY|ყინული · წინასწარ შეანელე
JUMP THE CART|გადაახტი ურიკას
FLOOR OFF|იატაკი გამორთულია
WIND RISING|ქარი ძლიერდება
WIND TUNNEL|ქარის გვირაბი
DUCK / WAIT|ჩაიკუზე / მოიცადე
RIDE THE LIFT|აჰყევი ამწეს
SHOOT / JUMP|ესროლე / ახტი
WATER RISING|წყალი იმატებს
WAIT / HIGH ROUTE|მოიცადე / ადი მაღლა
A GIFT — FOLLOW|საჩუქარი — გამომყევი
TRUST EARNED · SHIELD|ნდობა მოპოვებულია · ფარი
FOUND A CACHE|ნაპოვნია სამალავი
VALVE CLOSED|სარქველი დაკეტილია
HOLD ↓ STILL · EARN TRUST|გეჭიროს ↓ და გაჩერდი · მოიპოვე ნდობა
DIGGING…|თხრის…
FOLLOW THE RABBIT|გაჰყევი კურდღელს
FOLLOW TO THE VALVE|გაჰყევი სარქვლამდე
BAT SWOOP · HOLD ↓|ღამურა ეშვება · გეჭიროს ↓
FLAPPY FLIGHT|ფრთიანი ფრენა
FLIGHT COMPLETE!|ფრენა დასრულებულია!
FLIGHT OVER|ფრენა დასრულდა
Continue Endless|უსასრულოდ გაგრძელება
Replay Level 21|დონე 21-ის გამეორება
Restart Level 21|დონე 21 თავიდან
Campaign return|დონეებზე დაბრუნება
Tap to take flight|შეეხე ფრენის დასაწყებად
Loading character…|პერსონაჟი იტვირთება…
Space / ↑ / W / tap|Space / ↑ / W / შეხება
SNAKE DINO COMPLETE!|გველი დინოს დონე დასრულებულია!
SNAKE DINO|გველი დინო
ARENA CLEARED!|მოედანი შევსებულია!
GAME OVER|თამაში დასრულდა
Wall collision|კედელს შეეჯახე
Self collision|საკუთარ სხეულს შეეჯახე
ENDLESS READY|უსასრულო რეჟიმი მზადაა
Tap / Enter to resume|შეეხე / Enter გასაგრძელებლად
Arrows / WASD · Swipe or D-pad|ისრები / WASD · გასმა ან ღილაკები
P / Esc: pause|P / Esc: პაუზა
Tap arena|შეეხე მოედანს
Landscape|ჰორიზონტალური
Portrait|ვერტიკალური
Enter / Space / tap to start|Enter / Space / შეხება დასაწყებად
Campaign saved|პროგრესი შენახულია
Movement and audio frozen|მოძრაობა და ხმა შეჩერებულია
Replay Level 22|დონე 22 თავიდან
KEEP GOING!|განაგრძე!
solid walls|მყარი კედლები
food in one run|საკვები ერთ ცდაში
pipe pairs|წყვილი მილი
ms/cell|მწმ/უჯრა
of 3|სულ 3
`;
 const words = `
Titan Factory|ტიტანების ქარხანა
ZOMBIE KING|ზომბების მეფე
STEEL TITAN|ფოლადის ტიტანი
FLAME DEMON|ცეცხლის დემონი
FROST WRAITH|ყინვის ჩრდილი
OMEGA OVERLORD|ომეგა მმართველი
Caboose|ბოლო ვაგონი
Gatling|გატლინგი

CART|ურიკა
BRIDGE|ხიდი
DEFEND SEAL|დაიცავი ბეჭედი
WAVE|ტალღა

TURRET|ტყვიამფრქვევი
CYBER POLAR BEAR|კიბერნეტიკული თეთრი დათვი
MEGA-ZOMBIE|მეგაზომბი
PRO PLAYER CODE ACCEPTED!|პროფესიონალის კოდი მიღებულია!
TURBO DASH!|სწრაფი გარღვევა!
DOUBLE JUMP!|ორმაგი ნახტომი!
WALL JUMP!|კედლიდან ნახტომი!
TRAMPOLINE LAUNCH!|ბატუტიდან ახტომა!
SUPERSONIC BOOST STRIP!|ზებგერითი აჩქარების ზოლი!
COIN BAG|მონეტების ტომარა
SWINGING HOOK LATCHED!|ქანაობის კაუჭი დამაგრებულია!
MASSIVE SWING LAUNCH!|ძლიერი გაქნევა და ნახტომი!
SPRING|ზამბარა
CATCH & SWING|ჩაეჭიდე და გაიქანე
MECHA-BEAR|მექანიკური დათვი
GODZILLA - CITY DESTROYER|გოძილა — ქალაქის გამანადგურებელი
NO GUNS — SPEED & PARKOUR!|იარაღის გარეშე — სისწრაფე და პარკური!
HARDCORE MODE ACTIVE|ურთულესი რეჟიმი ჩართულია
NANOTECH SHIELD: ACTIVE|ნანოტექნოლოგიური ფარი ჩართულია
FASTENER|აჩქარება
PRESENTS|წარმოგიდგენთ
SPIN|დაატრიალე

LEVEL PROGRESS|დონის პროგრესი
FINISH|ფინიში
BOSS|მთავარი მტერი
SHIELD|ფარი
GOLDEN WINGS|ოქროს ფრთები
CRUMBLING|იშლება
HORDE|ურდო
BELOW|ქვემოთ
PUSH|მიაწექი
SHOP TOKEN|მაღაზიის ჟეტონი
TOKENS|ჟეტონი
COMPLETE|დასრულებულია

PAUSED|პაუზა
PAUSE|პაუზა
Resume|გაგრძელება
ENDLESS|უსასრულო რეჟიმი
CAMPAIGN|კამპანია
LEVEL|დონე
FOOD|საკვები
SCORE|ქულა
Clear|გაიარე
Eat|შეჭამე
segments|ნაწილი
Campaign best|კამპანიის რეკორდი
Endless best|უსასრულოს რეკორდი
Best length|სიგრძის რეკორდი
Length|სიგრძე
Medal|მედალი
BRONZE|ბრინჯაო
SILVER|ვერცხლი
GOLD|ოქრო
HEALTH|სიცოცხლე
MUTED|ხმა გამორთულია
MUSIC|მუსიკა
RELICS|რელიკვიები
OF JOURNEY|გზა გავლილია
CHALLENGE|სირთულე
NORMAL|ჩვეულებრივი
HARDCORE|ურთულესი
EASY|მარტივი
PISTOL|პისტოლეტი
SHOTGUN|თოფი
RIFLE|ავტომატი
SNIPER|სნაიპერი
MINIGUN|ტყვიამფრქვევი
PLASMA|პლაზმა
FLAMETHROWER|ცეცხლმტყორცნი
ROCKET|რაკეტა
LAUNCHER|გამშვები
COINS|მონეტები
SHOOT|ესროლე
CROUCH|ჩაიკუზე
LAND|დაეშვი
COLLECT|აიღე
SAVE|შენახვა
JUMP|ახტი
DUCK|ჩაიკუზე
WAIT|მოიცადე
OPEN|ღიაა
PRESS|დააჭირე
FOUND|ნაპოვნია
BARREL|კასრი
SECONDS|წამი
STEP|შეაბიჯე
SKILLS|უნარები
CHARACTERS|პერსონაჟები
WEAPONS|იარაღები
EQUIPPED|აღჭურვილია
OWNED|შეძენილია
PREVIEW|დათვალიერება
EQUIP|აღჭურვა
BUY|ყიდვა
EXPLORER|მკვლევარი
ADVENTURER|მოგზაური
COLLECTED|აღებულია
CLAIM|მიღება
REFRESH IN|განახლებამდე
SHOP TOKENS|მაღაზიის ჟეტონები
BALANCE|ბალანსი
DINO|დინო
EP|ეპიზოდი
FREIGHT|ტვირთი
POWER|ენერგია
EAST|აღმოსავლეთი
LAST TRAIN|ბოლო მატარებელი
CHARGING|იტენება
TO BEGIN|დასაწყებად
`;
 const entries=[...phrases.split('\n'),...words.split('\n')].filter(s=>s.includes('|')).map(s=>s.split('|')).sort((a,b)=>b[0].length-a[0].length);
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const rules=entries.map(([en,ka])=>[new RegExp(`(?<![A-Za-z])${escape(en)}(?![A-Za-z])`,'gi'),ka]);
 const cache=new Map(), missing=new Set();
 function translate(value){const s=String(value);if(!/[A-Za-z]/.test(s))return s;if(cache.has(s))return cache.get(s);let out=s.replace(/(\d+)s\b/g,'$1 წმ').replace(/(\d+)m\b/g,'$1 მ');for(const [r,ka] of rules)out=out.replace(r,ka);if(cache.size>3000)cache.clear();cache.set(s,out);return out;}
 function install(ctx){
  for(const name of ['fillText','strokeText','measureText']){const native=ctx[name].bind(ctx);ctx[name]=(value,...args)=>{const out=translate(value);if(name!=='measureText'&&/[A-Za-z]{2,}/.test(out.replace(/\b(?:Space|Enter|WASD|Shift|Esc|Tab|HP|XP)\b/gi,'')))missing.add(out);return native(out,...args);};}
 }
 return {translate,install,missing};
})();
