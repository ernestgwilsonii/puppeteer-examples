const puppeteer = require("puppeteer");

let person = {
  dob: "01/02/1945",
  occupation: "Essential Worker",
  city: "Lancaster",
  condition: "Obesity",
  state: "Pennsylvania",
};

async function myPuppet(person) {
  try {
    let headlessMode = true; // true hides the browser

    // Start with qualifier page
    let startingUrl = "https://www.riteaid.com/pharmacy/covid-qualifier";
    const browser = await puppeteer.launch({
      headless: headlessMode,
      slowMo: 0,
      //   args:[
      //     '--start-maximized' // you can also use '--start-fullscreen'
      //  ],
      defaultViewport: {
        width: 1600,
        height: 1160,
        deviceScaleFactor: 1,
      },
    });
    const page = await browser.newPage();
    await page.goto(startingUrl);


    // Fill out Page 1
    // Let's check if you qualify for the COVID-19 vaccine at this time.
    ////////////////////////////////////////////////////////////////////////////////

    // Date Of Birth
    await page.type("#dateOfBirth", person.dob);
    await page.keyboard.press("Tab");

    // What’s your occupation?
    await page.evaluate(() => {
      let occupation = "Essential Worker";
      let dom = document.querySelector("#Occupation");
      dom.outerHTML =
        '<a class="form__input dropdown down-arrow yourself occ-value" id="Occupation" data-toggle="dropdown" tabindex="2" occupation-code="' +
        occupation +
        '">Essential Worker</a>';
    });

    // City
    await page.type("#city", person.city);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Do you have any other medical conditions?
    await page.evaluate(() => {
      let condition = "Obesity";
      let dom = document.querySelector("#mediconditions");
      dom.outerHTML =
        '<a class="form__input dropdown down-arrow yourself medi-value" id="mediconditions" data-toggle="dropdown" tabindex="4" medicalcondition-code="' +
        condition +
        '">Obesity</a>';
    });

    // State
    await page.type("#eligibility_state", person.state);
    await page.keyboard.press("Tab");

    // Zip Code (optional)
    await page.type("#zip", "17603");
    await page.keyboard.press("Tab");

    // COVID-19 - Dose 1 (check box)
    await page.setViewport({ width: 1600, height: 1160 });
    await page.waitForSelector(
      ".covid-eligibilty__section > #eligibility > .form__group__eligible-vaccine-type > #vaccine-dose1 > label"
    );
    await page.click(
      ".covid-eligibilty__section > #eligibility > .form__group__eligible-vaccine-type > #vaccine-dose1 > label"
    );

    // Screen capture Page 1 - Did the "Next" button turn green?
    await page.screenshot({ path: "01_Riteaid-Covid_Page1-Next.png", fullPage: true });

    // Next (button)
    await page.waitForSelector(
      ".covid-scheduler-question > .container > .covid-eligibility > #continue > .cmp-button__text"
    );
    await page.click(
      ".covid-scheduler-question > .container > .covid-eligibility > #continue > .cmp-button__text"
    );

    // Sleep (need time for the "Great news!" box to appear!)
    await page.evaluate(async () => {
      await new Promise(function (resolve) {
        setTimeout(resolve, 4000);
      });
    });

    // Screen capture Page 1 - Did the "Great news!" box with the "Continue" button appear?
    await page.screenshot({ path: "02_Riteaid-Covid_Page1-Continue.png", fullPage: true });

    // Click "Continue" button in "Great news!" box
    await page.waitForSelector(
      "#error-modal > .modal__content > .error-modal > #learnmorebttn > .cmp-button__text"
    );
    await page.click(
      "#error-modal > .modal__content > .error-modal > #learnmorebttn > .cmp-button__text"
    );


    // Fill out Page 2
    // Select a Pharmacy (zip code search screen)
    ////////////////////////////////////////////////////////////////////////////////

    await page.waitForSelector(
      ".covid-store__inner-wrapper-content #btn-find-store"
    );

    // Wait for page 2 to load
    await page.evaluate(async () => {
      await new Promise(function (resolve) {
        setTimeout(resolve, 4000);
      });
    });

    // Screen capture Page 2 - Did the "Select a Pharmacy" screen appear?
    await page.screenshot({ path: "03_Riteaid-Covid_Page2-Select-a-Pharmacy.png", fullPage: true });

    await page.click(".covid-store__inner-wrapper-content #btn-find-store");

    // Sleep (need time for the list of stores to populate)
    await page.evaluate(async () => {
      await new Promise(function (resolve) {
        setTimeout(resolve, 4000);
      });
    });

    await page.waitForSelector(
      ".covid-store__stores > .covid-store__store:nth-child(1) > .covid-store__store__content > .covid-store__store__btn > .covid-store__store__anchor--unselected"
    );
    await page.click(
      ".covid-store__stores > .covid-store__store:nth-child(1) > .covid-store__store__content > .covid-store__store__btn > .covid-store__store__anchor--unselected"
    );

    // Sleep (need time for the "Next" button on page 2 to turn green after selecting a store)
    await page.evaluate(async () => {
      await new Promise(function (resolve) {
        setTimeout(resolve, 4000);
      });
    });

    await page.waitForSelector(".covid-scheduler #continue");
    await page.click(".covid-scheduler #continue");



    // Create PDF
    // NOTE Generating a pdf is currently only supported in Chrome headless <--MUST RUN HEADLESS FOR PDF!
    // REF: https://github.com/puppeteer/puppeteer/issues/6220
    //await page.pdf({ path: 'riteaid_covid.pdf' });

    // Close the browser
    //await browser.close();
  } catch (err) {
    console.error(err);
  }
}

myPuppet(person);
