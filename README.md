
### Develop using Ganache-cli

Metamask on locaHost is forcing networkId 1337. 

Run on Terminal 1:

```shell
ganache-cli -i 1337 -l 8000000 -m "virtual valve razor retreat either turn possible student grief engage attract fiber"
```


Run on Terminal 2:

```shell
truffle migrate --network development --skip-dry-run
```

This seed is only to develop locally. Do not use in production or testnet
