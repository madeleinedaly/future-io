# macho.js

Macho is an integration test runner.
Integration tests often contain dependencies between testcases,
and current test runners do a poor job of showing those:

A test runner that is aware between test relations would have two advantages:
- Testcases are shorter and clearer if there is no need to write down huge
  scenes in the before step of each test.
- Test output is more helpfull if it tells you ten testcases were skipped
  because one shared prerequisite step failed.
