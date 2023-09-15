# Rolling hash

When hashing an ID there is always the easy way of doing it, you have a salt and a messsage then you get a hash back, but what if you don't have a salt?

This package deals with that issue by making the hashed message rolling, that is once every 2 months it changes.

## Usage

### Installing

Currently there is no NPM Package for this repo, so import it directly with npm and git like this.

npm install BonnierNews/rolling-hash

Or use another way you feel comfortable with.

The application uses as of currently Node 18.17.1.

### running

The code is super simple.

example:

import rollingHash from "rolling-encrypt"; // Or if need be, use require

const rolledHash = rollingHash("some id");

// use rolledHash however you want after this!

## Disclaimer

How often the rolling hash changes are up to change, we can not guarantee that it will stay at 2 months.

We use the Date class to handle the hash, if this is modified in anyway we cannot guarantee that this will work a 100% of the time.
