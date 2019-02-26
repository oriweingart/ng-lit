const CONFIG = {
  URL: 'http://127.0.0.1:8081',
  PATH: 'test',
  FIXTURE: 'fixture.html',
  WAIT: 3000
}

const SELECTORS = {
  NG_LIT_ELM: '#ng-lit-element',
  NG_ELM: '#ng-element',
}

const init = async (nightmare, testFolder) => {
  const testName = testFolder.split("/")[testFolder.split("/").length-1];
  const url = `${CONFIG.URL}/${CONFIG.PATH}/${testName}/${CONFIG.FIXTURE}`;
  await nightmare.goto(url).wait(CONFIG.WAIT);
}

module.exports = {
  init,
  SELECTORS
};
