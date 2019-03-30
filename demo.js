/* eslint-disable array-callback-return,consistent-return,prefer-destructuring */
const fs = require('fs');

console.log(`
    <style>
    div {
        height: 100vh;
        display: grid;
        justify-content: center;
        align-items: center;
    }
    
    li {
        list-style: none;
    }
    a {
        background-color: #eee;
        font-size: 18px;
        border-radius: 8px;
        margin: 15px 0;
        padding: 15px;
        text-align: center;
        text-decoration: none;
        display: grid;
        justify-content: center;
        align-items: center;
     
    }
    description {
        display: grid;
        justify-content: center;
        align-items: center;
        color: #111;
        font-size: 14px;
    }
</style>
    <div>
        <ul>
          ${fs.readdirSync(`${__dirname}/test/e2e/`).map(testName => {
            if (fs.lstatSync(`${__dirname}/test/e2e/${testName}`).isDirectory()) {
              const testFiled = fs.readFileSync(`${__dirname}/test/e2e/${testName}/test.js`, 'utf8');
              let description;
              try {
                description = testFiled.split(' * ')[1].split("\n")[0];
              } catch (e) {
                // no description
              }
              return `<li>
                        <a href="/test/e2e/${testName}/fixture.html" target="_blank">
                        <description>${description}</description>
                        </a>
                      </li>`;
            }}).join('')}
        </ul>
    </div>
`);
