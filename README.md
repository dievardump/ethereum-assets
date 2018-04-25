# What is it 

This is an open list of on-chain assets, sorted by networks.

# Background

This is originally a fork of [https://github.com/ethereum-lists/tokens](https://github.com/ethereum-lists/tokens) as of 2018-04-17

I decided to not use the original repository because :
- my goal is to list all possible networks "assets" (current and future) and not only ERC20 compatible.
- I want to offer a bigger flexibility about the data to export
- the other repository uses Java as a dependency and I don't have nor want Java on my machine

# Assets

All types of assets are welcome. 

As of now, assets are sorted into erc20 and erc721 but any EIP/type of tokens can be added as long as there is enough informations 

## Format

The assets are saved in the directory `/data/assets`

They are sorted by Network (eth, kov, ...) and the by type (erc20, erc721, ...) and saved as a JSON file, that has for name the address of the asset contract in the chain.

As example, the (in)famous CryptoKitties' asset file has for path `/data/assets/eth/erc721/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d.json`

## Fields:

### Required

-  `address`:   On-chain address of the asset contract.
-  `name`:      Longer human version of asset name.
-  `symbol`:    Short ticker style symbol of asset.


### Optional

-  `meta`:      Meta data that brings informations to the asset. For example, contains `decimals` for erc20 tokens
-  `website`:   Official URL of the website.
-  `logo`:      An optional link to the logo of your asset.
-  `support`:   A support email, support URL, or other way people can get assistance regarding the asset.
-  `github`:    Where assets or assets-related code lives.
-  `community`: Twitter, Reddit, Slack or wherever else people hang out.


# The builds

in `/dist` you will find the last build `assets.json` containing a big object with all types of assets sorted by networks.

You can rebuild this list locally using the npm command `npm run build`

@TODO : Add default build to a CDN ?

## Custom Build

Custom builds are possible, selecting networks, types of asset and properties you want included in your build.

The command is the same `npm run build` followed by `-- ` and a list of arguments.
The build will be saved in `/dist/custom/`

### Custom build arguments

For every option, if not given, will take all the available ones.
Options values are comma separated

| Option | Description |
| --- | --- |
| `--network-id` | if present in `/data/networks.json`, uses the network id as key in the exported object (default uses directory name) |
| `--networks`       | list of networks (directory name) to add to your build. |
| `--assets`         | list of assets types (directory name) to add to every network. |
| `--properties`     | list of properties to add to every type. `symbol`, `name`, `address` and `meta` if in the object, will always be included. Sub properties filtering is not supported. If used without value, will only keep the mandatory fields. |


### Example 

Example of command that will only export Tokens for the Main Ethereum network and the Kovan Network, with only logo and website (and the required one):

`npm run build -- --networks=eth,kov --assets=erc20 --properties=logo,website`

Note the use of ` -- ` between the command name and the arguments.

# Contribution 

You can add your assets, or any assets you know off and missing, using merge requests. I will try to review them and add them to the repository.

# Note 

I am not willing to split the efforts with the original repository. But our goals are not the same. I am building this repository mainly because I will use it in a personal project, including all type of assets on the different networks.

# Donation

Not against any donation if this repo helps you in any way and you want to say thank you.
