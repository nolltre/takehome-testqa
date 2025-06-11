# takehome-testqa
Take home assignment for Datavant


My first encounter with the Cypress framework. Hold on to your hats...

Answers:
1. Done - this repo
1. Oddities:
    - Slight error in the test specification `Porto - Campanha` but the correct destination is `Porto Campanha` (without the dash)
    - The Portuguese site does not use the `/<lang>/buy-tickets` path. It has `/pt/comprar-bilhetes` instead
    - You cannot book ahead more than 2 months in advance
    - Filling in the departure date first and then the return date cancels out
    the return date. You need to fill in the return date first when doing so programmatically
    - The first letter of the month has to be uppercase even if it's not what the language requires (i.e. Portuguese)
3. Changes to the date handling:
    - I see two reasonable options:
      1. Change so that the date representation is universal. E.g. YYYY/MM/DD or similar. No localized text in those textboxes, the same regardless of language. If I want to have a readable text, I could add that in a different place, like on top.
      1. If the above isn't acceptable, it would be easier if the textbox accepted the input as a locale string (e.g. '10 June 2025' or '10 de junho de 2025') generated directly from the user's web browser settings.
    - The URL to the ticket buying site. Having a uniform way to access the site (either `/<lang>/buy-tickets` or `/<lang>/comprar-bilhetes`) reduces the number of endpoints to keep track of. In fact, that is what the next step (selecting the tickets) does
    - It would be nice if we stayed on the same domain. Saving state could make it possible to divide up into smaller tests.
    - Fix the bug that causes the test to fill in the return date before the departure date. I wouldn't book a journey that way. I would work with this flow:  
      > 1. select departure station  
      > 1. select destination station  
      > 1. select departure date  
      > 4. select return date (if wanted)  
      > 5. submit  

    **Caveats**:
    - Had to change the flow specified to make it work. Unbeknownst why that is, need investigating
    - Can't get the tests to function in Firefox or Firefox Dev, Chromium and Electron works fine. Looking at the issues in the Cypress GitHub repository it looks like a common issue. It may be linked to the specific version of Firefox used (138.0.3 (64-bit)).

## How to run it

Developed and tested on a Linux machine.

**Prerequisites:**  

| Software | Tested Version |
| ----- | ---- |
| Chrome or [Chromium] |  Chromium 136.0.7103.92 Arch Linux |
| [npm] | 11.3.0|
| [Node.js] | v23.9.0 |


On a command line, clone the repository (using the [GitHub CLI tool](https://cli.github.com/)), install :  
```bash
gh repo clone nolltre/takehome-testqa
# Install the dependencies
npm install
# Run the tests (using the standard browser, headless)
npm test
# Run the tests (using the standard browser, headed)
npm run test -- --headed
# Or, open the development environment with:
npm run open
```

## The Task
<details>
<summary>Expand to see the task</summary>

1. Write an automated solution that will:  
    1. Navigate to https://www.cp.pt/passageiros/en/buy-tickets  
    1. Submit the request for online tickets  
        1. Departing from Lagos  
        1. Arriving Porto - Campanha  
        1. Departing 3 days from Today  
        1. Return 5 days from Today  
    1. Click “Cancel”, which takes you back to the previous “Buy Tickets” screen  
    1. Validate all parameters for the train search are saved
1. Are there any oddities you noticed about the website from a functional or UX
perspective?
1. What changes would you make to the website for ease of implementation of a FE
automation test suite or general testing?

### Requirements:
- Preferred frameworks - Cypress preferred, Playwright secondary, Selenium or
other frameworks are alright as well
- Upload the solution to GitHub

### What We Look For:
- Comprehensive view of the use case, beyond just writing a test that works
- Proper architecture that allows for scalability, maintainability, and a
reasonable degree of flexibility regarding future, additional requirements
- Clean and organized code that can be read and understood by others. Style
counts!
- Be prepared to demonstrate what you’ve built and talk about all parts and
decisions fluently. Be able to explain your architecture and design choices. Be
comfortable talking about the pros and cons of your approach vs. other
approaches you may have considered.

### Important!
All work should be yours! An occasional StackOverflow, Cypress Blog (or an
equivalent website) search is, of course, permitted; but please keep these to a
reasonable minimum. If you absolutely must use content from StackOverflow (et
al.), please cite the exact URL that you used. The goal of this is that the
work you provide is your work, not someone else’s – use your best judgment.
</details>

[npm]: https://www.npmjs.com/
[Node.js]: https://nodejs.org/en 
[Chromium]: https://www.chromium.org/chromium-projects/
