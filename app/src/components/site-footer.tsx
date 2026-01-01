/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-gradient-to-b from-white via-white pt-10 to-muted/30 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-5 shadow-sm backdrop-blur">
          <div className="flex items-start gap-3">
            <Link href={"/"}>
              <img
                className="h-16 w-[170px] shrink-0 object-contain sm:h-20 sm:w-[230px] sm:-ml-4 sm:-mr-10"
                src="/logo.png"
                alt="WELLCOMP"
              />
            </Link>
            <div>
              <div className="text-xs uppercase tracking-wide text-primary">WELLCOMP</div>
              <div className="text-xl font-extrabold my-1">Segítünk választani</div>
              <p className="text-sm text-muted-foreground">
                Profi tanácsadás és ügyfélszolgálat vásárlás előtt és után is.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+36703176680"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:border-primary/60"
            >
              <Image src="/phone.svg" alt="Telefon" width={16} height={16} />
              +36 70 317 6680
            </a>
            <Link
              href="/kapcsolat#contact-form"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-primary/30 shadow-lg"
            >
              <Image src="/mail.svg" alt="E-mail" width={16} height={16} />
              Kapcsolat
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Termékkategóriák
            </h3>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <Link className="hover:text-foreground" href="/laptopok/osszes">
                Laptop
              </Link>
              <Link className="hover:text-foreground" href="/pc-k/osszes">
                PC
              </Link>
              <Link className="hover:text-foreground" href="/pc-k/kategoria/gamer-pc-300-600">
                Gamer PC
              </Link>
              <Link className="hover:text-foreground" href="/pc-k/kategoria/professzionalis-munkaallomas">
                Munkaállomások
              </Link>
              <Link className="hover:text-foreground" href="/telefonok/osszes">
                Telefon
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Fontos információk
            </h3>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <Link className="hover:text-foreground" href="/fizetes-szallitas">
                Fizetés és szállítás
              </Link>
              <Link className="hover:text-foreground" href="/garancia">
                Garancia
              </Link>
              <Link className="hover:text-foreground" href="/aszf">
                ÁSZF
              </Link>
              <Link className="hover:text-foreground" href="/adatvedelem">
                Adatkezelési tájékoztató
              </Link>
              <Link className="hover:text-foreground" href="/impresszum">
                Impresszum
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Hasznos linkek
            </h3>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <Link className="hover:text-foreground" href="/miert-mi">
                Miért vásároljon nálunk
              </Link>
              <Link className="hover:text-foreground" href="/blog">
                Blog
              </Link>
              <Link className="hover:text-foreground" href="/kapcsolat">
                Kapcsolat
              </Link>
              <Link className="hover:text-foreground" href="/gyik">
                GYIK
              </Link>
              <Link className="hover:text-foreground" href="/rolunk">
                Rólunk
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Elérhetőségek
            </h3>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <a className="hover:text-foreground" href="tel:+36703176680">
                +36 70 317 6680
              </a>
              <Link className="hover:text-foreground" href="/kapcsolat#contact-form">
                Kapcsolat
              </Link>
              <p className="text-foreground">H-P: 8:00 - 17:00</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} WELLCOMP. Minden jog fenntartva.</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Link href="mailto:info@wellcomp.hu" className="flex items-center gap-2 hover:text-foreground">
                <Image src="/mail.svg" alt="E-mail" width={16} height={16} />
                <span>info@wellcomp.hu</span>
              </Link>
              <Link href="tel:+36703176680" className="flex items-center gap-2 hover:text-foreground">
                <Image src="/phone.svg" alt="Telefon" width={16} height={16} />
                <span>+36 70 317 6680</span>
              </Link>
              <img src="/barionbannersm.png" alt="Barion" className="h-18 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
