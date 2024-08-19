#! /bin/bash

WORKDIR="${WORKDIR:-/home/user/workdir}"
CI_DEBUG="${CI_DEBUG:-false}"
BACKGROUND_PORT=3002
exit_code=0

source /usr/src/CI_OUTPUT.sh

if ! pushd "${WORKDIR}" >/dev/null; then
    ci_echo_error "Can't switch directory to '${WORKDIR}'" >&2
    exit 1
fi

ci_echo_title "Current configuration" "warn" >&2
ci_echo_info "
YARN=$(yarn --version)
NPM=$(npm --version)

WORKDIR=${WORKDIR}

CI_DEBUG=${CI_DEBUG}

Additional test params: $@
" >&2

ci_echo_info "Installing packages ..." >&2
ci_echo_debug "npm install --frozen-lockfile" >&2
npm install --frozen-lockfile

ci_echo_info "Building @nfid/identitykit package" >&2
ci_echo_debug "npm run build-identitykit" >&2
npm run build-identitykit

ci_echo_info "Running the playground ..." >&2
popd > /dev/null
ci_echo_debug "npm run playground" >&2
npm run playground >/dev/null 2>&1 &

ci_echo_debug 'Waiting Until DEV Playground UP ...' >&2
wait_until_up "http://localhost:3001" 120 5 '200|301|302|400'
wait_until_up "http://localhost:3002" 120 5 '200|301|302|400'
wait_until_up "http://localhost:3003" 120 5 '200|301|302|400'

ci_echo_info "Configuring playwright" >&2
ci_echo_debug "npx playwright install" >&2
npx playwright install

ci_echo_info "Running the tests..." >&2
ci_echo_debug "npm run test:e2e" >&2
npm run test:e2e || exit_code=$?

if [ "${exit_code}" -eq 0 ]; then
    status='success'
else
    status='error'
fi

ci_echo_title "Finished ( exit code ${exit_code} )" "${status}" >&2
exit ${exit_code}
