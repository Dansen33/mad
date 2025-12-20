export const metadata = {
  title: "Adatvédelmi tájékoztató | wellcomp",
  description: "wellcomp adatkezelési alapelvek: milyen adatot gyűjtünk és hogyan védjük.",
};

import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export default function AdatvedelemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProductHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-16 pt-8">
        <h1 className="text-3xl font-extrabold">WELLCOMP.HU Adatkezelési tájékoztató</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Szalai Dániel EV.
        </p>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">Adatkezelési tájékoztató</h2>
          <h3 className="text-base font-semibold text-foreground">Bevezetés</h3>
          <p>
            A/Az Szalai Dániel EV. (9086 Töltéstava, Virág utca 2/A, adószám: 90010668-1-28, cégjegyzékszám/nyilvántartási szám: 59133391) (a továbbiakban: Szolgáltató, adatkezelő)
            alá veti magát a következő szabályzatnak:
          </p>
          <p>
            A természetes személyeknek a személyes adatok kezelése tekintetében történő védelméről és az ilyen adatok szabad áramlásáról, valamint a 95/46/EK rendelet hatályon kívül helyezéséről
            (általános adatvédelmi rendelet) AZ EURÓPAI PARLAMENT ÉS A TANÁCS (EU) 2016/679 RENDELETE (2016. április 27.) szerint az alábbi tájékoztatást adjuk.
          </p>
          <p>
            Jelen adatvédelmi szabályzat az alábbi oldalak/mobil alkalmazások adatkezelését szabályozza: https://wellcomp.hu
          </p>
          <p>
            Az adatkezelési tájékoztató elérhető az alábbi oldalról: wellcomp.hu/adatvedelem
          </p>
          <p>
            A szabályzat módosításai a fenti címen történő közzététellel lépnek hatályba.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Az adatkezelő és elérhetőségei</h3>
          <p><strong>Név:</strong> Szalai Dániel EV.</p>
          <p><strong>Székhely:</strong> 9086 Töltéstava, Virág utca 2/A</p>
          <p><strong>E-mail:</strong> info@wellcomp.hu</p>
          <p><strong>Telefon:</strong> +36703176680</p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Fogalom meghatározások</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>személyes adat:</strong> azonosított vagy azonosítható természetes személyre vonatkozó bármely információ...</li>
            <li><strong>adatkezelés:</strong> a személyes adatokon vagy adatállományokon automatizált vagy nem automatizált módon végzett műveletek összessége...</li>
            <li><strong>adatkezelő:</strong> az a természetes vagy jogi személy, közhatalmi szerv, ügynökség vagy egyéb szerv, amely a személyes adatok kezelésének céljait és eszközeit meghatározza...</li>
            <li><strong>adatfeldolgozó:</strong> az az adatkezelő nevében személyes adatokat kezelő szervezet...</li>
            <li><strong>címzett:</strong> az a természetes vagy jogi személy, akivel a személyes adatot közlik...</li>
            <li><strong>érintett hozzájárulása:</strong> az érintett akaratának önkéntes, egyértelmű kinyilvánítása az adatkezeléshez való beleegyezésről...</li>
            <li><strong>adatvédelmi incidens:</strong> a személyes adatok jogellenes megsemmisülése, elvesztése, megváltoztatása, jogosulatlan közlése vagy hozzáférése...</li>
            <li><strong>profilalkotás:</strong> személyes adatok automatizált kezelése jellemzők elemzésére vagy előrejelzésére...</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">A személyes adatok kezelésére vonatkozó elvek</h3>
          <p>
            A személyes adatok kezelése jogszerűen, tisztességesen és átlátható módon történik; célhoz kötötten, adattakarékosan, pontosan és szükség szerint naprakészen; korlátozott tárolhatósággal; megfelelő technikai és szervezési intézkedésekkel biztosítva integritásukat és bizalmas jellegüket.
          </p>
          <p>
            Az adatkezelő felel e követelmények teljesítéséért és igazolhatóságáért.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Webáruház működtetéshez / szolgáltatás igénybevételéhez kapcsolódó adatkezelés</h3>
          <p className="font-semibold">1. Az adatgyűjtés ténye, a kezelt adatok köre és az adatkezelés célja</p>
          <div className="space-y-2">
            <p><strong>Felhasználói név:</strong> azonosítás, regisztráció lehetővé tétele. Jogalap: GDPR 6. cikk (1) bekezdés a) pontja.</p>
            <p><strong>Jelszó:</strong> biztonságos belépést szolgálja.</p>
            <p><strong>Vezeték- és keresztnév:</strong> kapcsolatfelvétel, vásárlás, számla, elállás. Jogalap: GDPR 6. cikk (1) bekezdés b) pontja.</p>
            <p><strong>E-mail cím:</strong> kapcsolattartás.</p>
            <p><strong>Telefonszám:</strong> kapcsolattartás, számlázási és szállítási egyeztetés.</p>
            <p><strong>Számlázási név és cím:</strong> számla kiállítása, szerződés teljesítése, követelések érvényesítése. Jogalap: 6. cikk (1) c) pontja, számviteli törvény 169. § (2) bekezdése.</p>
            <p><strong>Szállítási név és cím:</strong> házhoz szállítás. Jogalap: GDPR 6. cikk (1) b) pontja.</p>
            <p><strong>Vásárlás/regisztráció időpontja:</strong> technikai művelet. Jogalap: GDPR 6. cikk (1) b) pontja és Elker tv. 13/A. § (3) bekezdése.</p>
            <p><strong>IP cím:</strong> technikai művelet végrehajtása.</p>
          </div>
          <p>2. Érintettek köre: a webshopon regisztrált vagy vásárló érintettek. A felhasználónév és e-mail cím nem feltétlenül tartalmaz személyes adatot.</p>
          <p>
            3. Adatkezelés időtartama: az érintett törlési kérelméig tart, kivéve számviteli bizonylatok esetén 8 évig, illetve polgárjogi elévülési időig szolgálható ki a törlés a kérelmet követően.
          </p>
          <p>
            4. Az adatok megismerésére jogosultak: az adatkezelő és felhatalmazott munkatársai.
          </p>
          <p>
            5. Az érintett jogai: hozzáférés, helyesbítés, törlés, korlátozás, adathordozhatóság, hozzájárulás visszavonása.
          </p>
          <p>
            6. Jogok érvényesítése: postai úton (9086 Töltéstava, Virág utca 2/A), e-mailben (info@wellcomp.hu), telefonon (+36703176680).
          </p>
          <p>
            7. Az adatkezelés jogalapja: GDPR 6. cikk (1) b) pontja, Elker tv. 13/A. § (3), számviteli jogszabályok 6. cikk (1) c) pontja, Ptk. 6:22. § az elévülésre.
          </p>
          <p>
            8. Tájékoztatás: az adatkezelés szerződés teljesítéséhez és ajánlat adásához szükséges, az adatszolgáltatás elmaradása a rendelés feldolgozásának meghiúsulását eredményezi.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Cookie-k kezelése</h3>
          <p>
            1. A munkamenethez, bevásárlókosárhoz, biztonsághoz, statisztikához kapcsolódó sütikhez nem szükséges előzetes hozzájárulás.
          </p>
          <p>2. Kezelt adatok: egyedi azonosító, dátumok, időpontok.</p>
          <p>3. Érintettek: a weboldal látogatói.</p>
          <p>4. Cél: azonosítás, nyomon követés, testre szabott működés.</p>
          <p>5. Időtartam:</p>
          <ul className="list-disc pl-5">
            <li>Munkamenet sütik: a böngésző bezárásáig.</li>
            <li>Statisztikai, marketing sütik: 1 nap – 2 év, vagy az érintett hozzájárulásának visszavonásáig.</li>
          </ul>
          <p>
            6. Az adatokat az adatkezelő ismerheti meg.
          </p>
          <p>
            7. Jogok: a sütik törlése a böngésző adatvédelem menüjén keresztül.
          </p>
          <p>
            8. Böngészői beállítások dokumentációja: Google Chrome, Internet Explorer, Firefox, Safari (linkek a tájékoztatóban).
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Barion Pixel használata és marketing cookie-k</h3>
          <div className="space-y-2">
            <p>
              <strong>ba_vid:</strong> csalás kiszűrés, digitális ujjlenyomat, 1,5 évig.
            </p>
            <p>
              <strong>ba_vid.xxx:</strong> követés két munkamenet között, 1,5 évig.
            </p>
            <p>
              <strong>ba_sid / ba_sid.xxx:</strong> munkamenet azonosító, 30 percig.
            </p>
          </div>
          <p>
            Az élettartam meghosszabbodik minden látogatásnál. Az adatkezelés a Barion jogos érdeke csalás megelőzésére. További információk a tájékoztatóban.
          </p>
          <p>
            <strong>Marketing cookie-k:</strong> BarionMarketingConsent.xxx, Media and advertiser partners&apos; cookie. Hozzájárulás szükséges. Cél: releváns reklámok és ajánlatok; adatkezelés az érintett viselkedésére alapozva.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Adatfeldolgozó partnerek</h3>
          <p>Barion Marketing Cloud és Barion Pixel: DataMe Kft., 1118 Budapest, Ugron Gábor utca 35.</p>
          <p>Ügyfélszolgálat: Minerva-Soft Development & Provider LLC, 3900 Szerencs, Lipták út 1/a.</p>
          <p>Panaszkezelés telefonja: Interswitch LLC, 1056 Budapest, Irányi utca 15.</p>
          <p>Pénzmosási azonosítás: TechTeamer LLC, 1095 Budapest, Lechner Ödön sugárút 3. 2. 1., B.</p>
          <p>Forgalmi statisztika: MIXPANEL Inc., 405 Howard Street San Francisco, CA 94105.</p>
          <p>Könyvelés: In-Voice Kontroll LLC, 1046 Budapest, Leiningen Károly utca 16/B.</p>
          <p>Mobil parkolás és e-számlázás: KBOSS.hu LLC. (szamlazz.hu), 1031 Budapest, Záhony utca 7.</p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Google Ads konverziókövetés</h3>
          <p>
            Google Ads és konverziókövetés: Google Inc. (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA). A cookie-k személyes adatot nem tartalmaznak, a Google nem azonosítja a felhasználót.
          </p>
          <p>
            Ha a Felhasználó weboldalunkat Google-hirdetésen keresztül éri el, a cookie-k jelzik a kattintást. Minden Ads ügyfél más cookie-t kap.
          </p>
          <p>
            Adatok célja: Ads ügyfelei számára tökéletesítik a konverziós statisztikákat. A felhasználó nem azonosítható a cookie-k alapján.
          </p>
          <p>
            Konverziókövetés elutasítása: a cookie-k telepítésének letiltása a böngészőben; új cookie típusok (ad_user_data, ad_personalization) az érintett hozzájárulásával. A hozzájárulás visszavonása nem érinti korábbi adatkezelés jogszerűségét.
          </p>
          <p>
            További információ: https://policies.google.com/privacy
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Google Analytics alkalmazása</h3>
          <p>
            Google Analytics webelemző szolgáltatás, cookie-kat használ. Az IP-anonimizálással a Google az IP-cím rövidített változatát tárolja az EU-n belül. Teljes IP-cím USA-ba csak kivételes esetben kerül továbbításra.
          </p>
          <p>
            A Google értékeli a weboldalhasználatot, jelentéseket készít, és további szolgáltatásokat nyújt. Az IP cím nem kerül összekapcsolásra más adatokkal.
          </p>
          <p>
            Cookie-k tiltása: böngésző beállításainál (https://tools.google.com/dlpage/gaoptout?hl=hu) elérhető plugin.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Hírlevél, DM tevékenység</h3>
          <p>
            A 2008. évi XLVIII. törvény 6. § értelmében Felhasználó előzetesen hozzájárulhat reklámajánlatok fogadásához. Az Adatkezelő a hozzájárulás alapján kezeli az ehhez szükséges adatokat, de a felhasználó bármikor leiratkozhat, ekkor törli az összes ezzel kapcsolatos személyes adatot.
          </p>
          <p>
            Kezelt adatok: név, e-mail cím (azonosítás, hírlevél feliratkozás), feliratkozás időpontja, IP cím (technikai művelet). Jogalap: GDPR 6. cikk (1) a) pontja, 2008. évi XLVIII. törvény 6. § (5) bekezdése.
          </p>
          <p>
            Érintettek köre: hírlevélre feliratkozók. Cél: reklámküldés, tájékoztatás. Időtartam: hozzájárulás visszavonásáig. Címzettek: adatkezelő, marketing munkatársak.
          </p>
          <p>
            Jogok: hozzáférés, helyesbítés, törlés, korlátozás, tiltakozás, adathordozhatóság. Jogok érvényesítése: postai úton (9086 Töltéstava, Virág utca 2/A), e-mailen (info@wellcomp.hu), telefonon (+36703176680).
          </p>
          <p>
            Tájékoztatás: az adatkezelés a hozzájáruláson alapul, a részvételhez személyes adatokat meg kell adni, az elmaradás a hírlevél kiküldésének lehetetlenségét eredményezi. Visszavonás leiratkozással, az előző adatkezelés jogszerűsége nem sérül.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Panaszkezelés</h3>
          <p>
            Kezelt adatok: vezeték-/keresztnév, e-mail, telefonszám, számlázási név és cím (azonosítás, kapcsolattartás, minőségi igények kezelése). Jogalap: GDPR 6. cikk (1) c) pontja, fogyasztóvédelemről szóló 1997. évi CLV. törvény 17/A. § (7) bekezdése.
          </p>
          <p>
            Érintettek: vásárlók és panaszt tevők. Időtartam: jegyzőkönyvek 3 évig. Címzettek: adatkezelő és felhatalmazott munkatársai.
          </p>
          <p>
            Jogok: hozzáférés, helyesbítés, törlés, korlátozás, adathordozhatóság, hozzájárulás visszavonása. Jogok érvényesítése: postai úton (9086 Töltéstava, Virág utca 2/A), e-mailen (info@wellcomp.hu), telefonon (+36703176680).
          </p>
          <p>
            Tájékoztatás: az adatkezelés jogi kötelezettségen alapul, a szerződés megkötésének feltétele a személyes adatok kezelése, ennek elmaradása esetén nem tudjuk a panaszt kezelni.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Címzettek és adatfeldolgozók</h3>
          <p>
            Az adatkezelő kizárólag megfelelő garanciákat nyújtó adatfeldolgozókat vesz igénybe; ezek felelősségéért az adatkezelő tartozik. Az adatfeldolgozók csak az adatkezelő utasításai szerint járhatnak el, döntéshozói jogkörük nincs.
          </p>
          <p>
            Az informatika hátterét tárhely-szolgáltató, a kiszállítást futárszolgálat, a többi tevékenységet pedig a fenti partnerek végzik.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Adattovábbítás harmadik fél részére</h3>
          <p>
            Fuvarozás: MPL Magyar Posta Logisztika Kft. és GLS Magyarország Kft. Online fizetés: Barion Payment Zrt. (H-1117 Budapest, Infopark sétány 1., engedély: H-EN-I-1064/2013, intézmény azonosító: 14859034).
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Közösségi oldalak</h3>
          <p>
            Az adatkezelés Twitter/Pinterest/Youtube/Instagram/TikTok/LinkedIn oldalak regisztrált neveire és profilképeire terjed ki. Az érintett a közösségi oldalon nyilvános profilfelületén való részvétellel adta meg adatait. A cél a weboldal megosztása, népszerűsítése. Az adatkezelés a közösségi oldalak saját szabályzata szerint történik, jogalap az érintett önkéntes hozzájárulása.
          </p>
          <p>
            Facebook / Meta közös adatkezelés: Facebook Ireland Ltd. és az Adatkezelő közösen kezelik az Oldalelemzések révén gyűjtött statisztikákat. Privát üzenetekre csak az érintett kezdeményezése nyomán válaszol az Adatkezelő. Jogalap: GDPR 6. cikk (1) a) pontja.
          </p>
          <p>
            Kezelt adatok: regisztrált név, profilkép, az érintett által megosztott nyilvános információk. Adatforrás: érintett maga. Hozzájárulás visszavonható, a visszavonás után az Adatkezelő törli a beszélgetést.
          </p>
          <p>
            Az adatkezelés időtartama: hozzájárulás visszavonásáig; üzenet esetén 2 év. Címzettek: jogszabály által meghatározott állami szervek, hatóságok (bíróság, ügyészség, nyomozó hatóság, szabálysértési hatóság, NAIH) kivételes esetben.
          </p>
          <p>
            Az adatszolgáltatás elmaradása esetén nem tud az Adatkezelő a közösségi csatornán tájékoztatást adni vagy üzenetekre válaszolni. Automatizált döntéshozatal és profilalkotás nem történik.
          </p>
          <p>
            Facebook Ireland és Adatkezelő közös adatkezelői megállapodása: Oldalelemzések funkció függeléke részletezi a felelősségeket. Az Adatkezelő nem nyújthat ki Facebook felhasználói adatot a Facebook Ireland által kezelt Oldalelemzési adatokból, és nem járhat el az időközben beérkező adatvédelmi megkeresések kapcsán a Facebook nevében.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Ügyfélkapcsolatok és egyéb adatkezelések</h3>
          <p>
            Érdeklődések, problémák esetén az érintett a honlapon megadott csatornákon (telefon, e-mail, közösségi oldalak stb.) léphet kapcsolatba az Adatkezelővel. Az üzeneteket névvel, e-mail címmel és önként megadott további adatokkal együtt, legfeljebb 2 év után törli az Adatkezelő.
          </p>
          <p>
            Az e tájékoztatóban nem szereplő adatkezelésekről az adatfelvételkor ad tájékoztatást az Adatkezelő. Kivételes hatósági megkeresés vagy jogszabályi felhatalmazás esetén az Adatkezelő csak a célhoz elengedhetetlen mértékű adatot adja ki.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Az érintettek jogai</h3>
          <p>
            1. Hozzáférés joga: az érintett tájékoztatást kap arról, hogy személyes adatait kezelik-e, és hozzáférést kaphat a kezelésben szereplő adatokhoz.
          </p>
          <p>
            2. Helyesbítés joga: az Adatkezelő az érintett kérésére indokolatlan késedelem nélkül helyesbíti az pontatlan adatokat vagy kiegészíti a hiányos adatokat.
          </p>
          <p>
            3. Törlés joga: meghatározott feltételek esetén az Adatkezelő indokolatlan késedelem nélkül törli az érintettre vonatkozó személyes adatokat.
          </p>
          <p>
            4. Elfeledtetés joga: ha az Adatkezelő publikálta az adatot, az elérhető technológiák és költségek figyelembevételével intézkedik az adatkezelők értesítéséről a törlésről.
          </p>
          <p>
            5. Adatkezelés korlátozásához való jog: vitatott pontosság esetén, jogellenes kezelés esetén, jogi igényhez szükséges adatok esetén vagy ha az érintett tiltakozik.
          </p>
          <p>
            6. Adathordozhatóság joga: az érintett tagolt, géppel olvasható formátumban megkaphatja adatait, és továbbíthatja más adatkezelőnek.
          </p>
          <p>
            7. Tiltakozás joga: jogos érdek vagy közhatalmi jogosítvány által alapított adatkezelés ellen bármikor tiltakozhat az érintett; profilalkotás esetén is.
          </p>
          <p>
            8. Tiltakozás közvetlen üzletszerzés esetén: az érintett bármikor tiltakozhat a közvetlen üzletszerzés célú profilalkotás ellen; tiltakozás esetén az adatkezelés megszűnik.
          </p>
          <p>
            9. Automatizált döntéshozatal: az érintett jogilag vagy jelentős mértékben érintő automatizált döntés alól mentesülhet, kivéve, ha szerződés teljesítéséhez szükséges, jogi előírás lehetővé teszi, vagy érintett hozzájárul.
          </p>
          <p>
            Intézkedési határidő: az Adatkezelő legfeljebb 1 hónapon belül tájékoztatja az érintettet a kérelemre tett intézkedésekről; szükség esetén 2 hónappal meghosszabbíthatja a határidőt, erről az okok megjelölésével tájékoztat.
          </p>
          <p>
            Ha intézkedés nem történik, az Adatkezelő 1 hónapon belül értesíti az érintettet az okokról és a panasz benyújtásának lehetőségéről.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Az adatkezelés biztonsága</h3>
          <p>
            Az Adatkezelő és az adatfeldolgozó a technológia és költségek figyelembevételével megfelelő technikai és szervezési intézkedéseket hajt végre, beleértve az adatok álnevesítését, titkosítását, rendszerek folyamatos integritásának biztosítását, incidens utáni helyreállítási képességet és a biztonságos intézkedések hatékonyságának folyamatos értékelését.
          </p>
          <p>
            A kezelési helyekhez csak jogosultsággal rendelkező személyek férhetnek hozzá, papír alapú adatok zárt helyen, digitális adatok központi jogosultságkezelővel rendelkeznek.
          </p>
          <p>
            Az adatok törlése visszanyerhetetlenül történik, papír esetén iratmegsemmisítővel, elektronikus esetben selejtezési szabályok szerint.
          </p>
          <p>
            Fizikai védelem: dokumentumok zárt helyen, digitalizálás esetén digitális szabályok, adatkezelő munkatársak zárt helyiséget hagyhatnak el csak az adathordozók elzárásával, harmadik személyek nem férhetnek hozzá, épület tűz- és vagyonvédelemmel ellátott.
          </p>
          <p>
            Informatikai védelem: munkaeszközök az Adatkezelő birtokában, vírusvédelem, mentések, központi szerverhez csak kijelölt személyek férhetnek hozzá, adatokhoz felhasználónév-jelszó párossal lehet hozzáférni.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Adatvédelmi incidens</h3>
          <p>
            Ha magas kockázatot jelentő incidens történik, az érintettet indokolatlan késedelem nélkül, világosan tájékoztatjuk az incidens jellegéről, az érintett kapcsolattartójáról, a következményekről és az orvoslásra tett intézkedésekről.
          </p>
          <p>
            Nem kell tájékoztatni, ha megfelelő védelmi intézkedéseket alkalmaztak, további intézkedések biztosítják a kockázat megszűnését, vagy a tájékoztatás aránytalan erőfeszítést jelent (ekkor nyilvános tájékoztatás szükséges).
          </p>
          <p>
            Ha az Adatkezelő nem értesítette az érintettet, a felügyeleti hatóság előírhatja a tájékoztatást.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Adatvédelmi incidens bejelentése</h3>
          <p>
            Az incidens bejelentését legkésőbb 72 órán belül az illetékes felügyeleti hatóságnak kell megtenni (55. cikk), kivéve, ha nincs kockázat. Ha a jelentés késik, az indokokat dokumentálni kell.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Felülvizsgálat kötelező adatkezelés esetén</h3>
          <p>
            Ha törvény, rendelet vagy EU aktus nem határozza meg az időtartamot, az Adatkezelő legalább háromévente felülvizsgálja, hogy az adatkezelés szükséges-e, dokumentálja az eredményt, és tíz évig megőrzi azt a NAIH kérésére bemutatva.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Panasztételi lehetőség</h3>
          <p>
            Az Adatkezelő jogsértése esetén panasz tehető a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (1055 Budapest, Falk Miksa utca 9-11.; levelezési cím: 1363 Budapest, Pf. 9.; telefon: +36 1 391 1400; fax: +36 1 391 1410; e-mail: ugyfelszolgalat@naih.hu).
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">Zárszó</h3>
          <p>
            A tájékoztatót a következő jogszabályok figyelembevételével készítettük: GDPR (EU) 2016/679, 2011. évi CXII. törvény (Infotv.), 2001. évi CVIII. törvény (Elker tv.), 2008. évi XLVII. törvény, 2008. évi XLVIII. törvény, 2005. évi XC. törvény, 2003. évi C. törvény, 16/2011. sz. vélemény, valamint a NAIH ajánlása az előzetes tájékoztatásról.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
