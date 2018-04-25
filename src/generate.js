const {lstatSync, readdirSync, readFileSync, writeFileSync} = require('fs');
const {join, resolve} = require('path');
const FileHound = require('filehound');
const parseArgs = require('minimist');

// arguments parsing
const argv = parseArgs(process.argv.slice(2));

const filters = {
	networks: [],
	properties: [],
	assets: [],
	useNetworksId: argv['network-id'] === true,
};

if (argv.networks) {
	filters.networks = argv.networks.split(',');
}

if (argv.assets) {
	filters.assets = argv.assets.split(',');
}

if (argv.properties) {
	const unique = (curr, index, self) => self.indexOf(curr) === index;
	const mandatory = [
		'symbol',
		'name',
		'address',
		'meta',
	];

	filters.properties = mandatory;

	if ('string' === typeof argv.properties) {
		filters.properties = filters.properties.concat(
			...argv.properties.split(',')
		).filter(unique);
	}
}

const custom =
	filters.networks.length > 0 ||
	filters.assets.length > 0 ||
	filters.properties.length > 0 ||
	filters.useNetworksId === true;

let distDir = resolve(join(__dirname, '..', 'dist'));
if (custom) {
	distDir = join(distDir, 'custom');
}

const dataDir = resolve(join(__dirname, '..', 'data'));
const assetsDir = resolve(join(dataDir, 'assets'));
const distFile = join(distDir, 'index.json');

// helpers
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
	readdirSync(source)
		.map(name => ({
			name,
			path: join(source, name),
		}))
		.filter(dir => isDirectory(dir.path));

const getJSON = path => {
	const contents = readFileSync(path);
	return JSON.parse(contents);
};

const getNetworkIdent = networkName => {
	if (filters.useNetworksId && networksIds[networkName]) {
		networkName = networksIds[networkName];
	}

	return networkName;
};

const nextGenerate = (data, cb) => {
	return () => {
		const element = data.shift();
		cb(element);
	};
};

const networksIds = getJSON(join(dataDir, 'networks.json'));

//generator
const generated = {};

// get networks directories
const directories = getDirectories(assetsDir);

// nextNetworks function for networks
const nextNetworks = nextGenerate(directories, directory => {
	if (directory) {
		const networkName = directory.name;

		// network not wanted
		if (
			filters.networks.length &&
			filters.networks.indexOf(networkName) === -1
		) {
			return nextNetworks();
		}

		const networkIdent = getNetworkIdent(networkName);
		const currentNetwork = (generated[networkIdent] = {});

		console.log(`---- network : [${networkName}, ${networkIdent}]`);

		const assets = getDirectories(directory.path);
		const nextAssets = nextGenerate(assets, asset => {
			if (asset) {
				const assetName = asset.name;
				// network not wanted
				if (
					filters.assets.length &&
					filters.assets.indexOf(assetName) === -1
				) {
					return nextAssets();
				}

				const currentAsset = (currentNetwork[assetName] = {});

				const files = FileHound.create()
					.paths(asset.path)
					.ext('json')
					.find();

				files
					.then(results => {
						console.log(
							`---------- asset ${assetName} - ${
								results.length
							} files`,
						);
						for (var i = 0; i < results.length; i++) {
							const json = getJSON(results[i]);
							if (filters.properties.length) {
								Object.keys(json).forEach(key => {
									if (
										filters.properties.indexOf(key) === -1
									) {
										delete json[key];
									}
								});
							}

							currentAsset[json.address] = json;
						}

						console.log('end fl.read');
					})
					.finally(nextAssets);
			} else {
				nextNetworks();
			}
		});

		nextAssets();
	} else {
		writeFileSync(join(distDir, 'index.json'), JSON.stringify(generated));
	}
});

nextNetworks();
