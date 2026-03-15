import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const AnnualMeetings = async () => {
  // Check that the user is signed in, redirect to login page if not
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return redirect("/");
  }

  return (
    <div className="container max-w-screen-md p-8 lg:p-16">
      <h1>Talkoopistejärjestelmä</h1>
      <p className="mb-4">Päivitetty vuosikokouksessa 22.2.2026.</p>
      <p className="mb-2">
        Talkoopistejärjestelmällä velvoitetaan viikkoryhmissä treenaavat jäsenet
        osallistumaan erilaisiin järjestelytehtäviin OSEn toiminnassa. Tällä
        pyritään jakamaan kokeiden ja koulutustapahtumien järjestelyvastuuta
        tasapuolisesti jäsenten välillä.
      </p>
      <p className="mb-4">
        Jokaisen seuraavalle vuodelle viikkotreeniryhmäpaikan haluavan jäsenen
        on kerättävä kalenterivuoden aikana 7 talkoopistettä. Talkoopistetilanne
        kuluneen vuoden osalta tarkastellaan kunkin vuoden joulukuussa. Uusille
        jäsenille hyvitetään jäseneksi hyväksymisvuotenaan 4 talkoopistettä.
        Syyskaudella (1.8. jälkeen) hyväksyttyjen uusien jäsenten ei tarvitse
        kerätä talkoopisteitä jäljellä olevan kalenterivuoden aikana.
      </p>
      <p className="mb-2">Eri tehtävistä jaettavat talkoopisteet:</p>

      <table className="mb-2 w-full border-collapse border">
        <thead>
          <tr>
            <th className="bg-blue p-2 border">Tehtävä</th>
            <th className="bg-blue p-2 border">Pisteet</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Testaaja tai käyttöönottotarkastaja</td>
            <td>4</td>
          </tr>
          <tr>
            <td>
              Ylitoimitsija kokeessa tai käyttöönottotarkastuksessa (sis.
              muonituksen) *
            </td>
            <td>3</td>
          </tr>
          <tr>
            <td>Ratamestari kokeessa tai käyttöönottotarkastuksessa</td>
            <td>3</td>
          </tr>
          <tr>
            <td>Maali hakukokeessa</td>
            <td>1</td>
          </tr>
          <tr>
            <td>Maali käyttöönottotarkastuksessa</td>
            <td>2</td>
          </tr>
          <tr>
            <td>Jäljentekijä käyttöönottotarkastuksessa</td>
            <td>2</td>
          </tr>
          <tr>
            <td>Hälytysryhmän edustaja käyttöönottotarkastuksessa</td>
            <td>2</td>
          </tr>
          <tr>
            <td>Suunnistaja käyttöönottotarkastuksessa</td>
            <td>2</td>
          </tr>
          <tr>
            <td>Jäljentekijä ja tarvittaessa suunnistaja jälkikokeessa 2**</td>
            <td>2</td>
          </tr>
          <tr>
            <td>Avoimen treenin järjestäminen</td>
            <td>2</td>
          </tr>
          <tr>
            <td>Hälytreenin suunnittelu ja järjestäminen</td>
            <td>2</td>
          </tr>
          <tr>
            <td>
              Muu järjestävän ryhmän kanssa sovittu rooli hälytreenissä
              (jäljentekijä/maali)
            </td>
            <td>1</td>
          </tr>
          <tr>
            <td>Jonkin muun koulutustapahtuman järjestäminen</td>
            <td>2</td>
          </tr>
          <tr>
            <td>Osallistuminen johonkin muuhun OSEn talkootapahtumaan</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
      <p className="mb-2">
        *Mikäli ylitoimitsijan tehtäviä hoitaa useampi henkilö, niin
        talkoopisteet jaetaan noiden henkilöiden kesken.
      </p>
      <p className="mb-4">
        **Jäljentekijän tulee varautua myös suunnistamaan jälkikokeessa. Jollei
        sille ole tarvetta, saa jäljentekijä kuitenkin siinä tapauksessa 2
        pistettä. Jos nämä tehtävät jaetaan kahdelle eri henkilölle, kumpikin
        saa vain 1 pisteen. Mahdollisen erillisen suunnistajan hankkiminen on
        jäljentekijän vastuulla.
      </p>
      <p className="mb-4">
        Perutusta tai kokonaan järjestämättä jäävästä kokeesta tai
        käyttöönottotarkastuksesta voidaan antaa hallituksen päätöksellä
        kyseisen kokeen/tarkastuksen testaajalle/tarkastajalle, ratamestarille
        ja ylitoimitsijalle 2 talkoopistettä.
      </p>
      <p className="mb-4">
        Mikäli määritelty ehto talkootyön toteutumisesta ei täyty, OSEn hallitus
        tarkastelee henkilön tilanteen henkilön esittämän syyn perusteella.
        Hyväksyttäviä syitä tilanteeseen ovat samat kuin hälytysryhmään
        hakeutumisen 2 vuoden määräajan osalta.
      </p>
      <p className="mb-4">
        Jos henkilö menettää treeniryhmäpaikkansa, hän voi edelleen treenata
        vierailemalla eri treeniryhmissä. Treeniryhmäpaikan saa takaisin
        täyttämällä talkootyöehdon, eli hankkimalla 7 talkoopistettä.
      </p>
      <p className="mb-4">
        Kerätyt talkoopisteet ovat henkilökohtaisia eikä niitä voi jälkikäteen
        siirtää toiselle henkilölle. Toisen puolesta voi talkoilla ilmoittamalla
        asiasta talkootyön alkaessa. Talkootyöehdon ylittäviä talkoopisteitä ei
        voi siirtää seuraavalle vuodelle.
      </p>
    </div>
  );
};

export default AnnualMeetings;
