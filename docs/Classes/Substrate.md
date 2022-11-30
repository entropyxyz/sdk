# Substrate 

* The Substrate class has functions associated with using the entropy chain (which is built with substrate)
* The Substrate class also contains a WS connection and API object with the entropy chain that can be access directly (see polkadot.js for more documentation on that)

## Examples

### Setup
```js
	const privateKey =
    "0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a";
	const chainEndPoint = "ws://127.0.0.1:9944"

    const substrate = await Substrate.setup(privateKey, chainEndpoint);

```

### Accessing the underlying api object 

```js
const api = substrate.api 
```


## Substrate Read 

* If you only need access to reading the chain and don't require writing to it you can launch the SubstrateRead class which does not require a private key

```js
 const chainEndPoint = "ws://127.0.0.1:9944"
 const substrateRead = await SubstrateRead.setup(chainEndpoint)
```