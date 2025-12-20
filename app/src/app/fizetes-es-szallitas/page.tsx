export const metadata = {
title: "Fizetés és szállítás | wellcomp",
description:
"Fizetési módok, szállítási idők és költségek: kártyás fizetés Stripe-on keresztül, 24–48 órás kiszállítás.",
};

import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export default function FizetesSzallitasPage() {
return (
<div className="min-h-screen bg-background text-foreground">
<ProductHeader />
<main className="mx-auto max-w-5xl px-6 py-12 space-y-12">
<section className="space-y-6">
<h2 className="text-2xl font-semibold">Szállítás</h2>
<ul className="list-disc space-y-4 pl-6">
<li>
Futárral: A házhozszállítást a feladást követő 1, maximum 2 napig terjedő időintervallumban teljesíti a futárszolgálat az ön által megadott címre.
</li>
<li>
A feladott terméket futárral való kézbesítést választva törékeny csomagként értékbiztosítva küldjük!
</li>
<li>
A kézbesítés pontos időpontjáról a futárszolgálat a kiszállítást megelőzően értesíti önt!
<br />
Szállítási költség: 3 490 Ft
</li>
<li>
PostaPont: Ezzel szállítási móddal a Magyar Posta fiókjaiba vagy MOL töltőállomásokra kérheti a csomag kiszállítását.
<br />
Szállítási költség: 3 990 Ft
</li>
</ul>
</section>

    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Fizetés</h2>
      <ul className="list-disc space-y-4 pl-6">
        <li>
          Előre utalással: Összeg átutalása közvetlenül a bankszámlánkra. Kérem a rendelési azonosítót a megjegyzésbe írja bele. A megrendelést akkor fogadjuk el, ha megérkezett az összeg.
        </li>
        <li>
          WELLCOMP.HU ingyenes és biztonságos bankkártyás fizetés Barion-nal: A kényelmes és biztonságos online fizetést a Barion Payment Zrt. biztosítja, MNB engedély száma: H-EN-I-1064/2013.
          Bankkártya adatai áruházunkhoz nem jutnak el. A webshopunk a kártya-, illetve a mögötte álló számla adatainak, számának, lejárati dátumának semmilyen formában nincs birtokában, abba betekintést nem nyerhet.
        </li>
      </ul>
    </section>
  </main>
  <SiteFooter />
</div>
);
}