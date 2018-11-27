#!/bin/bash

source $OKTA_HOME/$REPO/scripts/setup.sh

export TEST_SUITE_TYPE="checkstyle"
export TEST_RESULT_FILE_DIR="${REPO}/build2"
echo $TEST_SUITE_TYPE > $TEST_SUITE_TYPE_FILE
echo $TEST_RESULT_FILE_DIR > $TEST_RESULT_FILE_DIR_FILE

if ! npm run lint:report; then
  echo "lint failed! Exiting..."
  # PUBLISH_TYPE_AND_RESULT_DIR_BUT_ALWAYS_FAIL will invoke bacon to parse results and display number of tests
  # and exit with failure, displaying all failed tests in BACON modal.
  exit ${PUBLISH_TYPE_AND_RESULT_DIR_BUT_ALWAYS_FAIL}
fi

exit $PUBLISH_TYPE_AND_RESULT_DIR;
