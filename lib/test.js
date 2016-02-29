module.exports = test;

function test (description, requirements, body) {

  function run (input) {
    return body(input);
  }

  run.description = description;

  return run;
}
