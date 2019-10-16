# OUTPUT

## Overview

Contains the results of the `audit`, which are later parsed.
The result of performing `yarn audit --json` is in `JSON Lines` which
must be traversed since every line in the output is a valid JSON object.
