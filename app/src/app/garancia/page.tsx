import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
title: "Garancia | WELLCOMP",
description: "Garanciális feltételek: alap 12 hónap, bővíthető opciók, bevizsgált, új eszközök.",
};

export default function GaranciaPage() {
return (
<div className="min-h-screen bg-background text-foreground">
<ProductHeader />
<main className="mx-auto max-w-5xl px-6 py-12 space-y-10">
<section className="space-y-4">
<p>
Ha egy termékre még van legalább fél év gyártói garancia, akkor a 2. pontban taglalt információk érvényesek.
Ha egy termékre már nincs gyártói garancia, vagy nem igazolható megléte (pl. elveszett a garanciapapír), cégünk vállal garanciát,
amelyről az 1. pontban olvashat.
</p>
</section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">1. WellComp Garancia esetében</h2>
      <p>
        Ez esetben a termékre a Szalai Dániel EV. (a WellComp.hu tulajdonosa) használt termékek esetén minimum 24 hónap garanciát vállal,
        amennyiben a termék eladáskor nem rendelkezik a minimálisan szükséges gyártói garanciával. Ha ennél kevesebbel rendelkezik,
        a garanciát a cég meghosszabbítja a szükséges időtartamig. Az adott termék leírásánál látható, hogy milyen hosszú jótállással értékesítjük a laptopot.
      </p>
      <p>
        A termék visszajuttatása a fogyasztó kötelezettsége, így a hibás termék forgalmazóhoz való eljuttatásának költsége a vevőt terheli. 3.000 Ft-ért
        tudunk belföldön futárt küldeni a készülékhez. A megjavított termék vevőhöz való visszajuttatásának költsége a forgalmazót terheli. Amennyiben a hiba nem garanciális,
        úgy a termék visszaszállítási díja is a vevőt terheli.
      </p>
      <p>
        Csak az eredeti garancialevél bemutatása után végezzük el a garanciális javítást. Számla/ nyugta nem szükséges a garanciális ügyintézéshez. Cserekészüléket
        bizonyos esetekben tudunk biztosítani. A garanciális időn belüli meghibásodásnál a terméket térítésmentesen bevizsgáljuk, javítjuk.
      </p>
      <p>
        Amennyiben a javítás nem lehetséges, a termék vételára levásárolható. Ha a termék javítása vagy cseréje nem lehetséges, vagy ha a vásárlónak okozott kényelmetlenség túlzott mértékű,
        illetve ha cégünk számára túlzott terhet jelent, a vevő kérheti a vételár visszatérítését. Jelentéktelen hiba miatt elállásnak nincs helye.
      </p>
      <p>
        Nem számít bele a jótállási időbe a kijavítási időnek az a része, amely alatt a fogyasztó a terméket nem tudja rendeltetésszerűen használni, tehát a garanciális ügyintézés során Cégünknél töltött idővel
        meghosszabbodik a garancia határideje. A jótállási idő újraindul, ha a terméket Cégünk kicseréli.
      </p>

<h3 className="text-xl font-semibold">Limitált garancia – kopóalkatrészek és természetes elhasználódás</h3>

<p>
  A garancia a rendeltetésszerű használat mellett bekövetkező, nem kopás jellegű hardverhibákra terjed ki.
  Felújított eszközöknél bizonyos alkatrészek természetes elhasználódása várható; ezekre (illetve az ebből eredő jelenségekre)
  a garancia nem vonatkozik.
</p>

<ul className="list-disc space-y-1 pl-6">
  <li><strong>Akkumulátor</strong> (kapacitáscsökkenés, üzemidő romlás, cella elöregedés, felpuffadás).</li>
  <li><strong>Billentyűzet</strong> (kopás, kifényesedés, felirat kopása, “lágyuló”/szivacsos érzet).</li>
  <li><strong>Érintőpad</strong> (kopás, felület elhasználódása, mechanikus kattintás romlása).</li>
  <li><strong>Kijelző háttérvilágítás</strong> (fényerő csökkenés, egyenetlenség, bevilágítás jellegű jelenségek).</li>
  <li><strong>Csatlakozók / aljzatok</strong> (USB/USB-C, töltőcsatlakozó, audio, HDMI/DP stb. kontakt-kopás, kilazulás, mechanikai sérülés).</li>
  <li><strong>Zsanérok</strong> (lazulás/szorulás, mechanikai kopás).</li>
  <li><strong>Ventilátor</strong> (zajosodás, csapágykopás), illetve a porosodásból eredő hűtési problémák.</li>

  <li><strong>Gombok és mechanikus kezelőszervek</strong> (bekapcsológomb, hangerőgomb, fedélzár, kártyatálca/sim tálca).</li>
  <li><strong>Hangszóró / mikrofon</strong> (szennyeződés, eltömődés, mechanikai igénybevétel miatti minőségromlás).</li>

  <li><strong>PC/asztali gép esetén</strong>: ház- és hűtőventilátorok, előlapi csatlakozók és kábelek (front I/O), mechanikus kapcsolók,
      porosodásból eredő hőfok-/stabilitásproblémák.</li>

  <li><strong>Telefon/handheld eszköz esetén</strong>: töltőport mechanikai kopása/oxidációja, csatlakozók, gombok,
      hangszóró/mikrofon szennyeződésből eredő hibái, kijelzőn karc/ütés/repedés, kameramodul karcolódás.</li>
</ul>

<p>
  <strong>Pixelhiba:</strong> pixelhibára az ISO 13406-2 szabvány figyelembevételével jár el az eladó.
</p>

<p>
  <strong>Tápegység / töltő:</strong> a laptophoz tartozó tápegységre (töltőre) 1 hónap garancia érvényes.
</p>

<p className="text-sm text-muted-foreground">
  A fenti korlátozások a természetes elhasználódásra és a mechanikai/használati eredetű meghibásodásokra vonatkoznak.
  A jótállás nem érinti a fogyasztót megillető, jogszabályban rögzített kellékszavatossági jogokat.
</p>
      <p>
        A készülék üzembe helyezése és beállítása nem tartozik a jótállási javítási kötelezettségek körébe (például operációs rendszer telepítése), ezt az ügyfél megrendelésére
        a szerviz külön díjtétel felszámítás ellenében vállalja.
      </p>
      <p>
        Ha a vásárlástól számított 3 munkanapon belül meghibásodik a termék, a forgalmazó köteles a terméket cserélni vagy, ha ez nem áll módjában, a vételárat visszaadni,
        feltéve, hogy a meghibásodás a rendeltetésszerű használatot akadályozza.
      </p>
      <p>
        Amennyiben a terméket Windows licensszel árulja Cégünk, az csak azt biztosítja, hogy a laptophoz jár Windows termékkulcs. Ez esetben a BIOS-ban digitálisan vagy
        a laptop alján matrica formájában van licenszkulcs a készülékhez, külön Windows telepítő lemez nincs.
      </p>
      <p>
        Amennyiben a készülék hibáját tartós tesztünk során sem tapasztaljuk, akkor a mindenkor érvényes listaárak alapján tesztelési díjat számítunk fel, garanciális készülékek esetében is.
        Az ügyfél köteles egyértelműen és hiánytalanul leírni a hiba jellegét. Amennyiben a bevizsgálás során fény derül arra, hogy termék hibás működése nem hardveres, hanem szoftveres okokból kifolyólag alakult ki,
        a forgalmazó bruttó 5000 Ft-os bevizsgálási díjat számíthat fel. Cégünk nem vállal felelősséget a garanciális termékkel együtt visszaküldött kiegészítőkért (pl. pendrive, memória kártya, lemez), ezért kérjük
        ne küldjön vissza semmilyen kiegészítőt, kivéve a tápegységet. Amennyiben a visszaküldött termék védelméhez jelszó van beállítva és ez lehetetlenné teszi a termék tesztelését, előfordulhat, hogy Cégünk nem tudja kideríteni és
        kijavítani a termék valamennyi hibáját.
      </p>
      <p>
        A fogyasztó köteles a termék hibájának felfedezése után azt a termék típusának és gyári számának, valamint a hibajelenség leírásának közlésével a kötelezettnek késedelem nélkül bejelenteni.
      </p>
      <p>
        A garanciális ügyintézés során adatvesztés történhet. Megkérjük kedves vásárlóinkat, hogy a garanciális ügyintézés kezdete előtt adatait mentse le, mivel az adatokért felelősséget nem tudunk vállalni.
        Semminemű adatvesztéssel kapcsolatos kárt nem köteles az eladó megtéríteni.
      </p>
      <p>
        Ha a laptop alján található garanciamatrica sérült, a garancia érvényét veszti. A garanciapapíron mindig szerepel, hogy van-e garanciamatrica a készülék alján.
        Amennyiben a vevő fogyasztó által cserélhető alkatrésszel kívánja bővíteni készülékét (pl. memória, háttértár), a bővítendő alkatrész beszerelését az eladó ingyenesen elvégzi,
        ha a vevő rendelkezésére bocsátja az adott alkatrészt. Amennyiben a vevő bővítés céljából nem tudja személyesen behozni a készüléket, a termék oda-vissza postázása a vevőt terheli.
      </p>
      <p>
        A garanciális alkatrészek cseréjének határideje kizárólag a beszállítótól/ garanciahelytől függ, az eladó a szervizelés időtartamáért nem vállal felelősséget. A garanciális termékjavításra történő átadástól számított lehető legrövidebb időn belül köteles Cégünk a termék javítását elvégezni. Ha a termék javítása 30 napon belül nem történik meg, Cégünk köteles a 30 napos határidőt követően 8 napon belül kicserélni a terméket vagy visszatéríteni annak vételárát. A javítás során a készüléket esetenként külső szervizbe javíttatjuk.
      </p>
      <p>
        Az eladó által cserélt alkatrészeknek teljesítmény és jellemző tulajdonságok tekintetében egyenértékűnek kell lenniük az eredeti alkatrészekkel, de nem feltétlenül újnak. A kicserélt hibás alkatrészek az eladó tulajdonába kerülnek.
      </p>
      <h3 className="text-xl font-semibold">Mire nem vonatkozik a garancia?</h3>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Az eladó nem vállal felelősséget a nem rendeltetésszerű használatból fakadó hibákért (pl. fizikai sérülés, szoftveres problémák, nem megfelelő tárolás) és a már meglévő alkatrészekkel fennálló inkompatibilitási problémákért.</li>
        <li>Ha a hiba a vásárlás után helytelen telepítésnek, nem megfelelő kiegészítőknek, kellékeknek, adathordozóknak, szoftver alkalmazásoknak köszönhető vagy a helytelen tárolás miatt alakul ki.</li>
        <li>Elemi kárnak, vagy egyéb külső tényezőnek, mint például szennyeződés, folyadéknak, áramingadozásnak, iparszerű igénybevételnek tulajdonítható okokból keletkezett hibákra.</li>
        <li>A különböző tisztítások, törések, fizikai sérülés, valamint a gumi és egyéb, természetesen kopó alkatrészek cseréjére.</li>
        <li>A szoftver hibákra, köztük az előre installált programok hibáira, a szoftverek felhasználásával, alkalmazásával okozott esetekre, károkra, BIOS vagy FIRMWARE frissítésre. Cégünk csak a hardver hibák kijavítására vállal garanciát, szoftverproblémákra nem, ezeket nem tudjuk, vagy szervizdíj ellenében tudjuk orvosolni.</li>
        <li>Számítástechnikai vírusok, kémprogramok, trójai programok stb. okozta károk, valamint adat- vagy programvesztések esetében. Merevlemez vagy más adathordozó meghibásodásából bekövetkezett adatvesztésekért, felelősséget nem vállalunk, az adatmentést csak garancián kívüli szolgáltatásként vállaljuk. Az adatok rendszeres mentése a Vevő kötelezettsége.</li>
        <li>Ha nem feljogosított személy, szerviz javítást vagy módosítást végez a készüléken, vagy megbontja a gépházat. Illetve, ha a termék sorozatszámát eltávolítják vagy módosítják.</li>
        <li>A terméket érő (véletlenszerű vagy egyéb jellegű) károsodás, amely nem érinti a termék működését vagy működőképességét, pl. egyebek között rozsdásodás, szín, textúra vagy felület megváltozása, elhasználódás, folyamatos amortizálódás.</li>
        <li>A termék jelszavas védelem miatt kialakuló használhatatlanságára.</li>
      </ol>
      <p>
        A fenti okokból meghibásodott termékek javítási költsége a jótállás időtartamán belül is a vásárlót terheli.
      </p>
      <p>
        A garanciában foglalt kivétellel és a vonatkozó törvény által megengedett legnagyobb mértékben Cégünk semmilyen körülmények között nem vállal felelősséget semmilyen közvetlen, közvetett, különleges, véletlenszerű vagy következményes kárigényéért...
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Garanciális készülék csomagolása és postázása</h2>
      <p>
        Ha nem tudja személyesen bevinni az irodába a garanciális problémával rendelkező készüléket, első lépésben érdemes elérhetőségünkön (email: info@wellcomp.hu, tel.: 06-70-317-66-80)
        érdeklődni, hogy garanciális-e a probléma. Amennyiben igen, kérjük írja le a problémát pontosan email címünkre, majd kérjük, postai úton jutassa el nekünk a készüléket.
      </p>
      <p>
        A csomagba kérjük tegye bele a számlát és garanciapapírt, valamint szükségünk lesz egy értesítési telefonszámra is.
        Ezen kívül szükséges a feladás után az info@wellcomp.hu-ra elküldeni a feladott csomag ragszámát (pl. MPL esetén PBVF-el kezdődő szám).
      </p>
      <p>
        Erre a címre tudja visszaküldeni nekünk a laptopot:
      </p>
      <address className="not-italic">
        Szalai Dániel EV. – WELLCOMP<br />
        Dobó utca 18.<br />
        9028 Győr
      </address>
      <p>
        A cég elérhetősége:<br />
        Telefonszám: 06 70 317 66 80<br />
        Email cím: info@wellcomp.hu
      </p>
      <p>
        A garanciális javítás ideje változó, csak bevizsgálás után tudjuk megmondani, hogy körülbelül mennyi időbe telik.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">2. Gyártói garancia esetében</h2>
      <p>
        A gyártói garanciával rendelkező laptopok esetében a garanciális ügyintézést átvállaljuk. Amennyiben az általunk eladott laptopban a gyári konfiguráció meg lett változtatva az általunk történt értékesítés időpontjáig,
        a cserélt alkatrész cégünkhöz garanciális a gyári garancia lejártáig, így nem kell attól tartania, hogy nem garanciális a készülék, mert az előző tulajdonos alkatrészt cserélt a készülékben.
      </p>
      <p>
        Néhány alapvető információ a különböző gyártók által kínált garanciáról:
      </p>
      <div className="space-y-4">
        <article>
          <h3 className="text-xl font-semibold">Dell laptop garancia</h3>
          <p>Lehet helyszíni és szerviz garancia. Erről tájékoztatást a garancia levél, illetve a Dell Magyarország tud adni.</p>
          <p>
            Központi ügyfélszolgálat: 06 80 016-157<br />
            Az információs telefonszám hívása előtt érdemes lefuttatni a Dell öndiagnosztikai programot.
          </p>
          <p>
            Garanciális szervizek:
          </p>
          <ul className="list-disc pl-6">
            <li>Humansoft Kft. 1107 Budapest, Makk utca 9-11. – +36 1 270 7600</li>
            <li>C Szerviz Kft., 2040 Budaörs, Vasút u. 15. – +36 1 451 3580</li>
            <li>FixDirect Kft., 1033 Budapest, Huszti út 34. – +36 1 452 4670</li>
          </ul>
          <p>
            Dell öndiagnosztikai program: indítása F12 gombbal, Diagnostics menüpont kiválasztása. Ezt megteheti a Dell online diagnosztikai programjával is:
            <a href="http://www.dell.com/support/diagnostics/us/en/555/?~ck=mn" className="text-primary underline ml-1" target="_blank" rel="noreferrer">
              Dell diagnostics
            </a>
          </p>
        </article>
        <article>
          <h3 className="text-xl font-semibold">HP (Hewlett Packard) laptop garancia</h3>
          <p>
            Hivatalos garanciális oldal: <a href="http://support.hp.com/hu-hu/contact-hp" className="text-primary underline" target="_blank" rel="noreferrer">support.hp.com</a>
          </p>
          <p>
            Telefonos segítségnyújtás: (06 40) 200 629; központi szám: 06-1/382-1111. A garanciális szervizek listája <a href="http://www.marker.hu/hp/szervizek.htm" className="text-primary underline" target="_blank" rel="noreferrer">itt</a>.
          </p>
        </article>
        <article>
          <h3 className="text-xl font-semibold">Acer laptop garancia</h3>
          <p>
            Közép-európai szerviz Brnoban (Csehország), mindenképpen futárral (UPS) szállítják a terméket. Pick Up garancia érvényes.
          </p>
          <p>
            Magyarországi központi szerviz: 06 1/555-5200 (munkanapokon 9-17 óráig). Szerviztámogatás online:
            <a href="http://www.acer.hu/ac/hu/HU/content/service-contact" className="text-primary underline ml-1" target="_blank" rel="noreferrer">
              acer.hu
            </a>
          </p>
        </article>
        <article>
          <h3 className="text-xl font-semibold">Toshiba laptop garancia</h3>
          <p>Call Center: 06-40/811-811.</p>
          <ul className="list-disc pl-6">
            <li>FixDirect Kft., 1033 Budapest, Huszti út 34. – +36-1-452-4670</li>
            <li>Laptoptech.hu, Budapest 1114, Bocskai út 21 – +36-1-225-75-66</li>
            <li>Aviatronic Kft., Konkoly-Thege Miklós út 29-33 – +36-1-392-0784</li>
          </ul>
        </article>
        <article>
          <h3 className="text-xl font-semibold">Fujitsu laptop garancia</h3>
          <p>
            Hibabejelentés a Service Desk felé: 06-40/200-440 munkanapokon. Központi szám: 06 1 999-0380.
          </p>
          <p>
            További információ: <a href="http://support.ts.fujitsu.com/warranty/Index.asp?lng=HU&Level1=&LNID=3549" className="text-primary underline" target="_blank" rel="noreferrer">support.ts.fujitsu.com</a>
          </p>
          <p>
            Fő szerviz: SERCO Kft., Budapest 1037, Bécsi út 314 – +36-1-272-2150. Márkaszerviz: Profi Szerviz HU Zrt., Budapest 1131, Kucsma utca 42-44 – (1) 814 8080.
          </p>
        </article>
        <article>
          <h3 className="text-xl font-semibold">Packard Bell – 2 év</h3>
          <p>
            Javítást az Acer ügyfélszolgálatán lehet kérni: 06-1/577-7766 (9-17 óra között). Futárt küldenek a készülékért, majd visszaszállítják.
          </p>
          <p>
            Részletek: <a href="http://www.packardbell.hu" className="text-primary underline" target="_blank" rel="noreferrer">packardbell.hu</a>
          </p>
        </article>
        <article>
          <h3 className="text-xl font-semibold">ASUS – 2 év</h3>
          <p>
            Utazó garancia háztól-házig: +36-1-505-4561 (hétköznapokon 9-17 óráig). Szervizszolgáltatás online megrendelése: <a href="http://www.asus.hu/rma" className="text-primary underline" target="_blank" rel="noreferrer">asus.hu/rma</a>.
          </p>
          <p>
            Garanciális szerviz: FixDirect Kft., 1033 Budapest, Huszti út 34 – +36-1-452-4670.
          </p>
        </article>
        <article>
          <h3 className="text-xl font-semibold">LENOVO – 2 év</h3>
          <p>
            Lenovo/IBM ThinkPad garancia: <a href="https://pcsupport.lenovo.com/in/en/warrantylookup" className="text-primary underline" target="_blank" rel="noreferrer">lenovo.com/warrantylookup</a>
          </p>
          <p>
            Ideapad háztól-házig garancia, hívja az ügyfélszolgálati számot: 80/987-425 vagy látogasson el a <a href="www.teleperformance.com" className="text-primary underline" target="_blank" rel="noreferrer">teleperformance.com</a> oldalra.
          </p>
        </article>
        <article>
          <h3 className="text-xl font-semibold">MSI</h3>
          <p>
            Garanciális ügyintézés: Albacomp Zrt. (vagy kijelölt partnere). Szerviz: Albacomp MSI szerviz, 1139 Budapest, Frangepán utca 8-10 – +36-1-329-1493 / +36-22-515-413.
          </p>
          <p>
            Call Center: 06-1-236-7777, futár: futar@albacomp.hu.
          </p>
        </article>
      </div>
    </section>
  </main>
  <SiteFooter />
</div>
);
}