export const metadata = {
  title: "Általános Szerződési Feltételek | wellcomp",
  description: "wellcomp ÁSZF: vásárlási feltételek, fizetés, szállítás, elállás.",
};

import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export default function AszfPage() {
  return (
    <><div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-16 pt-8">
        <h1 className="text-3xl font-extrabold">Általános Szerződési Feltételek</h1>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Jelen dokumentum alapján létrejött szerződés nem kerül iktatásra (utólag nem hozzáférhető, a szerződés megkötését a rendelési adatok bizonyítják),
            ráutaló magatartással tett jognyilatkozattal jön létre, nem minősül írásbeli szerződésnek, magyar nyelven íródik, magatartási kódexre nem utal.
            A webshop működésével, megrendelési, és szállítási folyamatával kapcsolatosan felmerülő kérdések esetén a megadott elérhetőségeinken rendelkezésére állunk.
          </p>
          <p>
            Jelen ÁSZF hatálya Szolgáltató weblapján (https://wellcomp.hu) és aldomainjein történő jogviszonyokra terjed ki. Jelen ÁSZF folyamatosan elérhető (és
            letölthető, bármikor kinyomtatható) a következő weboldalról:
          </p>
          <p>
            <a href="https://www.wellcomp/aszf">https://www.wellcomp/aszf</a>
          </p>

          <h2 className="text-lg font-semibold text-foreground">Definíciók</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Felhasználó:</strong> Bármely természetes, jogi személy, vagy szervezet, aki Szolgáltató szolgáltatásait igénybe veszi, Szolgáltatóval szerződést köt.</li>
            <li><strong>Fogyasztó:</strong> Olyan Felhasználó, aki a szakmája, önálló foglalkozása vagy üzleti tevékenysége körén kívül eljáró természetes személy.</li>
            <li><strong>Vállalkozás:</strong> A szakmája, önálló foglalkozása vagy üzleti tevékenysége körében eljáró személy.</li>
            <li><strong>Szolgáltató:</strong> Az információs társadalommal összefüggő szolgáltatást nyújtó természetes, illetve jogi személy vagy jogi személyiség nélküli szervezet, aki a Felhasználó számára szolgáltatást nyújt, aki a Felhasználóval szerződést köt.</li>
          </ul>

          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Szolgáltató adatai</h2>
            <p><strong>Név:</strong> WELLCOMP.HU Kft.</p>
            <p><strong>Székhely / panaszügyintézés:</strong> 9086 Töltéstava, Virág utca 2/A</p>
            <p><strong>Kapcsolattartás:</strong> info@wellcomp.hu</p>
            <p><strong>Cégjegyzékszám:</strong> 59133391</p>
            <p><strong>Adószám:</strong> 90010668-1-28</p>
            <p><strong>Nyilvántartó hatóság:</strong> Fővárosi Törvényszék</p>
            <p><strong>Telefonszám:</strong> +36 70 317 6680</p>
            <p><strong>Szerződés nyelve:</strong> magyar</p>
            <div className="space-y-1">
              <p><strong>Tárhely-szolgáltató:</strong></p>
              <p>RackForest Informatikai Kereskedelmi Szolgáltató és Tanácsadó Zrt.</p>
              <p>1132 Budapest, Victor Hugo utca 11., 5. emelet</p>
              <p>Tel.: +36 1 211 0044</p>
              <p>E-mail: info@rackforest.hu</p>
              <p>Web: <a href="https://rackforest.hu/">https://rackforest.hu/</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Alapvető rendelkezések</h2>
            <p>
              A jelen ÁSZF-ben nem szabályozott kérdésekre, valamint jelen ÁSZF értelmezésére a magyar jog az irányadó, különös tekintettel a Polgári Törvénykönyvről szóló 2013.
              évi V. törvény („Ptk.”) és az elektronikus kereskedelmi szolgáltatások, az információs társadalommal összefüggő szolgáltatások egyes kérdéseiről szóló 2001. évi CVIII. (Elker.
              tv.) törvény, valamint a fogyasztó és a vállalkozás közötti szerződések részletes szabályairól szóló 45/2014. (II.26.) Korm. rendelet rendelkezéseire. Speciális termékekre a vonatkozó ágazati jogszabályi rendelkezések az irányadók. A vonatkozó jogszabályok kötelező rendelkezései a felekre külön kikötés nélkül is irányadók.
            </p>
            <p>
              A jelen ÁSZF 2025. december 05. napjától hatályos és visszavonásig hatályban marad. Módosításait a Szolgáltató a weboldalon közzéteszi, illetve a regisztrált vagy korábban vásárló Felhasználókat e-mailben értesíti.
              A módosítások nem érintik a korábban megkötött szerződéseket.
            </p>
            <p>
              Szolgáltató fenntart magának minden jogot a weboldal, annak részletei és tartalmai tekintetében. Tilos a tartalmak letöltése, elektronikus tárolása, feldolgozása és értékesítése a Szolgáltató írásos hozzájárulása nélkül (kivéve a jelen dokumentumot és az adatkezelési tájékoztatót).
            </p>
            <p>
              Szolgáltató nem vállal felelősséget más, általa nem üzemeltetett weboldalakon közzétett termékek adásvételével kapcsolatban.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Regisztráció / vásárlás</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                A valótlan adatokkal kötött szerződést a jogosult fél megtámadhatja, és az a megkötés időpontjától érvénytelen lehet, vagy egy leplezett szerződés alapján kell megítélni a jogokat.
              </li>
              <li>
                A Szolgáltató nem felel a pontatlan adatok miatti késedelemért, de az egyeztetés után javítható a rendelés.
              </li>
              <li>
                Szolgáltató nem felel a jelszó elfelejtéséből adódó károkért, ha a hozzáférés nem a Szolgáltató hibájából lett illetéktelenek számára hozzáférhető.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Megvásárolható termékek, szolgáltatások köre és árai</h2>
            <p>
              A webáruházból online (bizonyos esetekben telefonon) is rendelhetők termékek. Az árak forintban, bruttó értendők, nem tartalmazzák a szállítási és fizetési költségeket. Külön csomagolási költség csak speciális csomagolás esetén kerül felszámításra.
            </p>
            <p>
              A webshop részletesen feltünteti a termék nevét, leírását és fotóját.
            </p>
            <p>
              Akciós ár bevezetésekor Szolgáltató teljes körű tájékoztatást nyújt, betartva a 4/2009. (I.30.) NFGM-SZMM rendelet szabályait.
            </p>
            <p>
              Hibás áron megadott rendelés esetén Szolgáltató visszautasíthatja a megrendelést, vagy felajánlhatja a helyes árat; Felhasználó ekkor dönthet a megrendelés fenntartásáról vagy lemondásáról.
            </p>
            <p>
              Hibás árnak minősül:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>0 Ft-os ár</li>
              <li>1 Ft-os ár</li>
              <li>az akciós ár, ami nem felel meg a feltüntetett kedvezménynek</li>
            </ul>
            <p>
              A szerződés akkor jön létre, ha a felek akaratát kölcsönösen és egybehangzóan kifejezték. Ha nincs ilyen nyilatkozat, nincs érvényes szerződés.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Rendelés menete</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Felhasználó regisztrált vagy vendégként is vásárolhat.</li>
              <li>Beállítja a kívánt mennyiséget és kosárba helyezi a termékeket.</li>
              <li>Ha szükséges, törölheti a kosár tartalmát vagy módosíthatja a mennyiséget.</li>
              <li>Kitölti a szállítási címet és kiválasztja a fizetési/szállítási módot.</li>
            </ul>
            <div className="space-y-2">
              <p className="font-semibold">Fizetési módok:</p>
              <p><strong>Személyes átvétel:</strong> Készpénzben a megjelölt helyszínen (H-P 10:00-18:00, Sz-V zárva).</p>
              <p><strong>Fizetés utánvétellel:</strong> A futárnak vagy csomagponton készpénzben vagy bankkártyával.</p>
              <p><strong>Átutalással:</strong> A visszaigazoló e-mailben szereplő bankszámlára 3 napon belül.</p>
              <p><strong>Online bankkártyával:</strong> Biztonságos fizetési rendszer használata.</p>
              <p><strong>Bankkártyás fizetés XYZXYZnal:</strong> A XYZXYZ Payment Zrt. kezeli a bankkártya adatokat, engedélyszám: H-EN-I-1064/2013.</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Szállítási költségek (bruttó):</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fáma futár házhoz: 2.500 Ft</li>
                <li>GLS futár házhoz: 3.490 Ft</li>
                <li>PostaPont: 3.500 Ft</li>
              </ul>
              <p>Utánvét esetén minden alkalommal 3.000 Ft utánvét kezelési díj.</p>
            </div>
            <p>
              Hibák esetén Szolgáltató fenntartja a jogot az adatok korrekciójára; erről azonnal tájékoztatja a vevőt, aki megerősítheti vagy elállhat.
            </p>
            <p>
              A fizetendő végösszeg a visszaigazolásban szereplő költségekkel együtt értendő. A csomagot a kézbesítéskor érdemes ellenőrizni (Ptk. 6:127. §); sérülés esetén nem kötelező átvenni.
            </p>
            <p>
              A „megrendelem” gombra kattintás előtt ellenőrizhetőek az adatok és megjegyzést lehet küldeni.
            </p>
            <p>
              Megrendeléssel Felhasználó tudomásul veszi a fizetési kötelezettséget. Az adatbeviteli hibák a rendelés lezárása előtt javíthatók, beleértve a kosár módosítását, törlését.
            </p>
            <p>
              A megrendelés elküldése után automatikus visszaigazolás érkezik; ha 48 órán belül nem, akkor a kötöttség megszűnik. A visszaigazolás akkor tekinthető beérkezettnek, ha hozzáférhető Felhasználó számára.
            </p>
            <p>
              Az automata visszaigazolás nem hoz létre szerződést; a szerződés akkor jön létre, amikor Szolgáltató újabb e-mailben értesíti a Felhasználót a részletekről és teljesítés várható időpontjáról.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Megrendelések feldolgozása és teljesítés</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>A feldolgozás beérkezési sorrendben, munkanapokon történik; munkaidőn kívüli rendelések a következő nap kerülnek feldolgozásra.</li>
              <li>A Szolgáltató elektronikus úton visszaigazolja a teljesítés időpontját.</li>
              <li>Általános teljesítési határidő: 2 munkanapon belül.</li>
              <li>A Felhasználó köteles fizetni és átvenni a terméket.</li>
              <li>Kárveszély a fogyasztó esetén a termék átvételénél, a fuvarozó megbízásakor a vevőre száll át.</li>
              <li>Késedelem esetén póthatáridő kijelölhető, ennek eredménytelen lejárta után elállás lehetséges.</li>
              <li>Ha a Szolgáltató a teljesítést megtagadja, vagy a szerződésben rögzített időben kellett volna teljesítenie, a Felhasználó elállhat.</li>
              <li>A késedelem esetén a fogyasztónak nem kell bizonyítania az érdeksérelem megszűnését, ha a teljesítési idő meghatározott és nem teljesült.</li>
            </ul>
            <p>
              Ha a termék nem áll rendelkezésre, Szolgáltató haladéktalanul tájékoztatja a Felhasználót, visszatéríti az összeget, és biztosítja egyéb jogainak érvényesítését.
            </p>
            <p>
              Ha a Felhasználó nem veszi át a terméket, szerződésszegést követ el, és Szolgáltató a tárolási és szállítási költséget érvényesítheti. Ebben az esetben jogi költség is a Felhasználót terheli.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Elállás joga</h2>
            <p>
              Az Európai Parlament és a Tanács 2011/83/EU irányelve és a 45/2014. (II.26.) Korm. rendelet alapján a fogyasztó indokolás nélküli elállási joggal rendelkezik.
            </p>
            <p>
              A fogyasztó az elállást a termék átvételétől vagy a szolgáltatás szerződéskötésétől számított 14 napon belül gyakorolhatja. Ha Szolgáltató nem teljesítette a tájékoztatási kötelezettséget, a határidő 12 hónappal meghosszabbodik; később történő tájékoztatás esetén újabb 14 nap áll rendelkezésre.
            </p>
            <p>
              Az elállást egyértelmű nyilatkozattal vagy a rendelet mellékletében található minta alapján lehet jelezni. Az elállási idő a termékátvétel napjától számított 14 nap.
            </p>
            <p>
              A termék visszaküldésének költsége a fogyasztót terheli, Szolgáltató más költséget nem számít fel. Nem illeti meg elállási jog például egyedi gyártás, romlandó áru, zárt csomagolású egészségügyi termék, digitális tartalom már megkezdett teljesítése esetén.
            </p>
            <p>
              A fogyasztónak a termék használatából eredő értékcsökkenésért kell felelnie, ha az meghaladja a tulajdonságok megismeréséhez szükséges használatot.
            </p>
            <p>
              A távollevők között kötött szerződéstől Szolgáltató a visszatérítést 14 napon belül teljesíti, az eredeti fizetési móddal, további többletköltség nélkül.
            </p>
            <p>
              A fogyasztó köteles az árut 14 napon belül visszaküldeni vagy átadni, amennyiben az írásbeli elállás megtörtént. A határidő betartottnak minősül, ha a terméket időben feladta.
            </p>
            <p>
              A fogyasztó elállását írásban, telefonon vagy személyesen jelezheti; a postára adás időpontját vesszük figyelembe az írásos jelzésnél.
            </p>
            <p>
              A fogyasztó nem viseli az elállással kapcsolatos költségeket, ha Szolgáltató nem tett eleget tájékoztatási kötelezettségének, vagy a digitális tartalom teljesítését előzetesen engedélyezte anélkül, hogy tudomásul vette volna jogainak megszűnését.
            </p>
            <p>
              Több termék esetén minden tétel vonatkozásában külön kell számolni az utolsó átvételtől számított 14 napot.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Jótállás, Szavatosság</h2>
            <p>
              Szolgáltató hibás teljesítés esetén kellékszavatossági és jótállási kötelezettséget vállal, a feltételeket a Polgári Törvénykönyv szabályai határozzák meg. A fogyasztói szerződésben tett fogyasztói hátrányos kikötés semmis.
            </p>
            <p>
              A fogyasztó a kellékszavatosság vagy termékszavatosság alapján választása szerint kérheti a kijavítást, kicserélést, ellenszolgáltatás leszállítását vagy elállást. Ugyanakkor a választott jogról áttérhet másikra, az átállás költségeit viseli, ha azok indokolatlanok.
            </p>
            <p>
              A fogyasztó jogosult az ellenszolgáltatás részbeni vagy teljes visszatartására is, amennyiben a vállalkozás nem teljesít szerződésszerűen.
            </p>
            <p>
              Kellékszavatossági igényt a hibának a felismeréstől számított 2 hónapon belül kell jelezni; a szerződés teljesítésétől számított 2 év (használt termékeknél 1 év) alatt érvényesíthető. Digitális tartalom esetén a hiba a teljesítés időpontjától számított két éven belül következik be.
            </p>
            <p>
              A fogyasztónak az áru kijavítása vagy cseréje érdekében a vállalkozás rendelkezésére kell bocsátania a hibás terméket, és a kicserélt termék visszavételét a vállalkozás költségére kell biztosítania.
            </p>
            <p>
              A termékszavatossági igényhez a fogyasztónak kell bizonyítani a hiba meglétét a forgalomba hozatal pillanatában; a fogyasztó a gyártóval szemben érvényesítheti a követeléseit.
            </p>
            <p>
              Jótállás esetén a Szolgáltató felsorolt időtartamokra (10 000 és 250 000 Ft közötti 2 év, 250 000 Ft feletti 3 év) vállal kötelezettséget, amely a termék átadásától vagy üzembe helyezésétől kezdődik. A fogyasztó a kijavítást vagy cserét közvetlenül is kérheti a Szolgáltató telephelyein vagy javítószolgálatainál.
            </p>
            <p>
              Ha a fogyasztási cikk nem javítható, Szolgáltató 8 napon belül cseréli vagy visszatéríti a vételárat. A harmadik javítás után ismételt meghibásodás esetén ugyancsak 8 napon belül kell cserélni vagy visszatéríteni. Ha a kijavítás 30 napon belül nem történik meg, 8 napon belül kicserélhető vagy visszatéríthető.
            </p>
            <p>
              A kötelező jótállás alól a Szolgáltató akkor mentesül, ha bizonyítja, hogy a hiba a teljesítés után keletkezett. Nem jár jótállás szakmai elvárható élettartamon túli termékekre, vagy ha a hiba a nem rendeltetésszerű használatból keletkezett.
            </p>
            <p>
              Ha a fogyasztó a termék hibáját a vásárlástól számított három napon belül jelzi, Szolgáltató köteles kicserélni a terméket, amennyiben a meghibásodás akadályozza a rendeltetésszerű használatot.
            </p>
            <p>
              A jótállás gyakorlása speciális követelményeket támaszthat (például időszakos felülvizsgálat), ha azok arányosak és szükségesek a biztonságos üzemeltetéshez.
            </p>
            <p>
              A kötelező jótállás alá tartozó termékek listája: <a href="https://njogszabaly.hu/10-2024-vi-28-im-rendelet" target="_blank" rel="noreferrer">10/2024. (VI. 28.) IM rendelet</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Szavatossági igény esetén történő eljárás</h2>
            <p>
              A 19/2014. (IV.29.) NGM rendelet szerint a fogyasztói szerződés keretében a felek nem térhetnek el a rendelet alapelveitől a fogyasztó hátrányára. A fogyasztó köteles bizonyítani a szerződés megkötését (számla vagy nyugta).
            </p>
            <p>
              A szavatossági kötelezettség teljesítésével kapcsolatos költségek Szolgáltatót terhelik. Szolgáltató köteles jegyzőkönyvet felvenni a bejelentett igényekről, aminek másolatát haladéktalanul a fogyasztó rendelkezésére kell bocsátani.
            </p>
            <p>
              Ha az igény teljesíthetőségéről nem tud nyilatkozni, öt munkanapon belül kell igazolható módon értesíteni a fogyasztót, beleértve az elutasítás indokát és a békéltető testülethez fordulás lehetőségét.
            </p>
            <p>
              A jegyzőkönyvet három évig kell megőrizni. A kijavítást vagy cserét lehetőleg 15 napon belül kell elvégezni; hosszabb idő esetén tájékoztatni kell a fogyasztót az időtartamról.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Vegyes rendelkezések</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Szolgáltató közreműködőt igénybe vehet, annak jogellenes magatartásáért teljes felelősséggel tartozik.</li>
              <li>Ha a Szabályzat része érvénytelenné válik, a többi rész érvényességét nem érinti.</li>
              <li>Jogok elmulasztása nem jelenti lemondást, kivéve, ha írásban kifejezetten rögzítették.</li>
              <li>Vitás ügyeket a felek békés úton próbálják rendezni.</li>
              <li>Az irányadó jog a magyar jog; fogyasztó esetén az alperes lakóhelye szerinti bíróság illetékes.</li>
              <li>Szolgáltató nem alkalmaz eltérő hozzáférési vagy fizetési feltételeket az állampolgárság vagy lakóhely alapján.</li>
              <li>Szolgáltató megfelel az EU-s területi alapú korlátozások elleni rendeleteknek.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">11. Panaszkezelés rendje</h2>
            <p>
              Szolgáltató célja a megfelelő minőségű teljesítés. A fogyasztó szóban vagy írásban tehet panaszt. Szóbeli panasz azonnal kivizsgálásra kerül, vagy jegyzőkönyvet vesznek fel.
            </p>
            <p>
              A jegyzőkönyv másolatát a fogyasztó részére át kell adni, telefonos panasz esetén legkésőbb az érdemi válasszal egyidejűleg. A panasz telefonos azonosítószámot kap.
            </p>
            <p>
              A jegyzőkönyvnek tartalmaznia kell a fogyasztó adatait, panasz részleteit, bizonyítékokat, a vállalkozás álláspontját, aláírásokat és figyelmeztetést.
            </p>
            <p>
              Ha a fogyasztó nem adja meg a szükséges adatokat, az e pontok alkalmazását mellőzni lehet.
            </p>
            <p>
              Írásbeli panaszt 30 napon belül érdemben meg kell válaszolni, ellenkező esetben a hatóság által meghatározott más határidő érvényes. Ha elektronikus űrlap érkezik, a beérkezést haladéktalanul vissza kell igazolni.
            </p>
            <p>
              A panaszokat és válaszokat három évig meg kell őrizni. Az elutasítás esetén írásban tájékoztatni kell a fogyasztót a hatósági vagy békéltető testület elérhetőségéről, valamint, hogy történt-e általános alávetési nyilatkozat.
            </p>
            <p>
              Az ismételt, azonos tartalmú panasz kivizsgálása mellőzhető. Panasza esetén fogyasztó a kormányhivatalhoz fordulhat (<a href="https://kormanyhivatalok.hu/kormanyhivatalok">https://kormanyhivatalok.hu/kormanyhivatalok</a>).
            </p>
            <p>
              Békéltető testületek elérhetőségei:
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-semibold">Budapesti Békéltető Testület</p>
                <p>Címe: 1016 Budapest, Krisztina krt. 99.</p>
                <p>Telefon: (1) 488-2131</p>
                <p>Fax: (1) 488-2186</p>
                <p>E-mail: <a href="mailto:bekelteto.testulet@bkik.hu">bekelteto.testulet@bkik.hu</a></p>
                <p>Honlap: <a href="https://bekeltet.bkik.hu/">https://bekeltet.bkik.hu/</a></p>
              </div>
              <div>
                <p className="font-semibold">Baranya Vármegyei Békéltető Testület</p>
                <p>Címe: 7625 Pécs, Majorossy Imre u. 36.</p>
                <p>Telefon: (72) 507-154 / (20) 283-3422</p>
                <p>Fax: (72) 507-152</p>
                <p>E-mail: <a href="mailto:info@baranyabekeltetes.hu">info@baranyabekeltetes.hu</a>, <a href="mailto:kerelem@baranyabekeltetes.hu">kerelem@baranyabekeltetes.hu</a></p>
                <p>Honlap: <a href="http://www.baranyabekeltetes.hu/">www.baranyabekeltetes.hu</a></p>
              </div>
              <div>
                <p className="font-semibold">Borsod-Abaúj-Zemplén Vármegyei Békéltető Testület</p>
                <p>Címe: 3525 Miskolc, Szentpáli u. 1.</p>
                <p>Telefon: (46) 501-091 / 501-871</p>
                <p>E-mail: <a href="mailto:bekeltetes@bokik.hu">bekeltetes@bokik.hu</a></p>
                <p>Honlap: <a href="http://www.bekeltetes.borsodmegye.hu/">www.bekeltetes.borsodmegye.hu</a></p>
              </div>
              <div>
                <p className="font-semibold">Csongrád-Csanád Vármegyei Békéltető Testület</p>
                <p>Címe: 6721 Szeged, Párizsi krt. 8-12.</p>
                <p>Telefon: (62) 554-250/118</p>
                <p>Fax: (62) 426-149</p>
                <p>E-mail: <a href="mailto:bekelteto.testulet@csmkik.hu">bekelteto.testulet@csmkik.hu</a></p>
                <p>Honlap: <a href="http://www.bekeltetes-csongrad.hu/">www.bekeltetes-csongrad.hu</a></p>
              </div>
              <div>
                <p className="font-semibold">Fejér Vármegyei Békéltető Testület</p>
                <p>Címe: 8000 Székesfehérvár, Hosszúséta tér 4-6.</p>
                <p>Telefon: (22) 510-310</p>
                <p>Fax: (22) 510-312</p>
                <p>E-mail: <a href="mailto:bekeltetes@fmkik.hu">bekeltetes@fmkik.hu</a>, <a href="mailto:fmkik@fmkik.hu">fmkik@fmkik.hu</a></p>
                <p>Honlap: <a href="http://www.bekeltetesfejer.hu/">www.bekeltetesfejer.hu</a></p>
              </div>
              <div>
                <p className="font-semibold">Győr-Moson-Sopron Vármegyei Békéltető Testület</p>
                <p>Címe: 9021 Győr, Szent István út 10/a.</p>
                <p>Telefon: (96) 520-217</p>
                <p>E-mail: <a href="mailto:bekeltetotestulet@gymskik.hu">bekeltetotestulet@gymskik.hu</a></p>
                <p>Honlap: <a href="https://gymsmkik.hu/bekelteto">https://gymsmkik.hu/bekelteto</a></p>
              </div>
              <div>
                <p className="font-semibold">Hajdú-Bihar Vármegyei Békéltető Testület</p>
                <p>Székhely: 4025 Debrecen, Petőfi tér 10.</p>
                <p>Ügyintézés: 4025 Debrecen Vörösmarty u. 13-15.</p>
                <p>Telefon: (52) 500-710 / 500-745</p>
                <p>Fax: (52) 500-720</p>
                <p>E-mail: <a href="mailto:bekelteto@hbkik.hu">bekelteto@hbkik.hu</a></p>
                <p>Honlap: <a href="https://www.hbmbekeltetes.hu">https://www.hbmbekeltetes.hu</a></p>
              </div>
              <div>
                <p className="font-semibold">Pest Vármegyei Békéltető Testület</p>
                <p>Címe: 1055 Budapest, Balassi Bálint u. 25. IV/2.</p>
                <p>Telefon: +36 1 792 7881</p>
                <p>E-mail: <a href="mailto:pmbekelteto@pmkik.hu">pmbekelteto@pmkik.hu</a></p>
                <p>Honlap: <a href="http://www.pestmegyeibekelteto.hu/">www.pestmegyeibekelteto.hu</a></p>
              </div>
            </div>
            <p>
              A békéltető testület célja a fogyasztói jogvita bírósági eljáráson kívüli rendezése, egyezség hiányában döntést hoz, amely kötelezést vagy ajánlást tartalmazhat.
            </p>
            <p>
              Online határon átnyúló jogvita esetén a fogyasztóvédelemért felelős miniszter által kijelölt kamara békéltető testülete illetékes. Szolgáltató együttműködési kötelezettsége kiterjed a válaszirat megküldésére és az egyezség létrehozására feljogosított képviselő biztosítására.
            </p>
            <p>
              Sikertelen békéltető eljárás esetén a fogyasztó bírósághoz fordulhat. A keresetlevél tartalmazza az eljáró bíróságot, felek adatait, jogalapot, bizonyítékokat, és hatáskör/illetékesség alapját.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">12. Szerzői jogok</h2>
            <p>
              A <a href="https://wellcomp.hu">https://wellcomp.hu</a> weboldal szerzői jogi mű, annak tartalmát csak a Szolgáltató írásos hozzájárulásával lehet többszörözni, újra közzétenni vagy felhasználni – kivéve az ÁSZF-et és az adatkezelési tájékoztatót.
            </p>
            <p>
              Az oldal tartalmát csak hivatkozással lehet átvétel esetén is felhasználni. Szolgáltató fenntartja jogait a szolgáltatás összes elemére, domain neveire, reklámfelületeire.
            </p>
            <p>
              Tilos az oldal adaptációja, visszafejtése, felhasználói azonosítók és jelszavak tisztességtelen létrehozása, vagy olyan alkalmazás használata, amely módosítja vagy indexeli az oldalt.
            </p>
            <p>
              A <strong>WELLCOMP.HU</strong> név szerzői jogi védelem alatt áll; felhasználása kizárólag a Szolgáltató írásos engedélyével történhet.
            </p>
            <p>
              Jogosulatlan használat esetén kötbér vonatkozik: képenként bruttó 60 000 Ft, szavanként bruttó 20 000 Ft, illetve 40 000 Ft/nap. Szolgáltató közjegyzői ténytanúsítást alkalmaz a jogsértővel szemben.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">13. Adatvédelem</h2>
            <p>
              Az adatkezelési tájékoztató elérhető: <a href="https://wellcomp.hu/adatvedelem">https://wellcomp.hu/adatvedelem</a>
            </p>
            <p>
              Győr, 2025. december 05.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Elállási nyilatkozat minta</h2>
            <p>(Csak a szerződéstől való elállási szándék esetén töltse ki és juttassa vissza)</p>
            <p><strong>Címzett:</strong> WELLCOMP.HU Kft., 9086 Töltéstava, Virág utca 2/A, <a href="mailto:info@wellcomp.hu">info@wellcomp.hu</a>, +36 70 317 6680</p>
            <div className="space-y-2">
              <p><strong>Alulírott kijelentem, hogy gyakorlom elállási/felmondási jogomat az alábbi termék/ek adásvételére:</strong></p>
              <p><strong>Megrendelés időpontja / átvétel időpontja:</strong></p>
              <p><strong>Fogyasztó(k) neve:</strong></p>
              <p><strong>Fogyasztó(k) címe:</strong></p>
              <p><strong>A fogyasztó(k) aláírása (írásbeli értesítés esetén):</strong></p>
              <p><strong>Dátum:</strong></p>
            </div>
          </section>

        </div>
      </div>
    </div><SiteFooter /></>
  );
}
