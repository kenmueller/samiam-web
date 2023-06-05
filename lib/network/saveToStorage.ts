import Network from '.'

const saveNetworkToStorage = (network: Network) => {
	localStorage.setItem('network', JSON.stringify(network))
}

export default saveNetworkToStorage
