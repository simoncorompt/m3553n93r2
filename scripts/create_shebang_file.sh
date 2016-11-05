#!/bin/bash

touch ./dist/shebang.bundle.js
echo '#!/usr/bin/env node --harmony' > ./dist/shebang.bundle.js
cat ./dist/bundle.js >> ./dist/shebang.bundle.js
