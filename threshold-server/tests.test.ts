import { ThresholdServer } from '.'
import { spinThreshold, spinChain, sleep, removeDB } from '../testing-utils'
const { assert } = require('chai')
import { BigNumber, ethers } from 'ethers'
import { ITransactionRequest, Arch } from './types'

const LOCAL_SERVER = '127.0.0.1:3001'

// Example of an unsigned transaction
const exampleUnsignedEvmTx = (): ethers.utils.UnsignedTransaction => {
  return {
    to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
    value: BigNumber.from('1'),
    chainId: 1,
    nonce: 1,
    data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes('Created On Entropy')),
  }
}

describe('Threshold Tests', () => {
  const thresholdServer = new ThresholdServer()
  let serverProcess, chainProcess
  const chainPath = process.cwd() + '/testing-utils/test-binaries/entropy'
  const serverPath = process.cwd() + '/testing-utils/test-binaries/server'

  beforeEach(async function () {
    chainProcess = await spinChain(chainPath, '--dev')
    serverProcess = await spinThreshold(serverPath, 'alice', '3001')
    await sleep(7000)
  })

  afterEach(async function () {
    serverProcess.kill()
    chainProcess.kill()
    removeDB()
  })

  it(`sends key`, async () => {
    const mock =
      '{"msg":"0x45ba6cf271a76d93fe135f788c5f725ab8182e297c16853e2efb02423dfb8d2a575b7f55130e375ceadb891cd0ef1677fbeb65633a8ea0f11a7de6fc9ca28a4fee9d30cede7c92699ab5bd98e781d8f79c0b46943a2161baba78830c0c163007381183e3e97c462559a05695d6fa9c48bd8929d325c332bd50da3d2b4e6b63e8c3d5b6d1be101b38175cb300d4573137db2b8df1b517c572557eefaffc57c9cb8681026542067dfeeb5eb33c095d8951ba6af09283e701a178292df275c6f50fa2eec6b797ceada8279a4d32ba8aa11dd674e107e7e15394f89777563b704cd44ebe8d6558ae847e05a12bda10c196553fdb7221034be235a4b01eba05805f202d1ac6fcb83272e1e36c1c35726c61e97b38d32e4ec10dee6e7506aa8a8f7af86b200c7e31ebf2b82b3562afe68833a274f8293c5de525cd0f00ba06d942d2e5453ad39d825f38beaf5cbfef8a871ba6b5c61563a922d22fcee582e1042bfe60eeed3e469f47ae3ceb9fbef2d770092bddb191779dd279168440c2cfbf12cfed6943ee7f2c299dd6727ffc050a4e39c61899982665fe150655fa56b8d19dfcc790334f278cebdede8a17c5c90612686dbb357b62de12befefabd0986a8e095a93f982beb3523077e771f9297973409c22844ab5d3cc4ff0ccfd3a1c6e01eff8220f53a8b3b75885a2f6ff2174bbab59612476b57d9699af72deff7f90611d961f663aaf290470d59cf195c478f61df1a347719b7e8b26c4e7d8bb78adf89ad9166a4c1c469cd978946bc1fe859b44467b5fd27807498c0e1c86a4c77ef632d280ea5bfa9efb88b4202b61db26742ff8ac8cf90ff97d4cf5ae332f03db1e973c6f0f6ce96d04e5294cc244abed6fee12fadd59e3967d71619c06437345b36d79313d588a9e7e07cc45cb747718f34e11a0fb3551b9a3eb38debd7842d6022937ff1beb9b3e8223d3e6adad698169b4f7e4f2572e32c174afaa59ffc65b36fa53b8d3c9b542ec33d3216b41964dd5e769fd74d4aa294de9fe1d8c0c6be839117244dc2f9bcc5ac4cd326164d9893cfe406b867104875644a99a9fbe90317662b03958b64c20bdf07abcdff50b52ccfbaa22ed417855c9dea34a35f4318e18c5de10a5aa459d30042638238de66b3bbf5961bfbc6595ead2b0b189009a3ba0efdb1628aef4bab3acfadb546163cce4c1329bf2fe9cf8a3c6d29ec56a8d9f9b0c19d3b802564723b84d9dd5d2c73b175161409107438fb294fc6961173c6b7719471db6fc4c105a4121ba4847f180ae24d3967237aab1c8bcec8763bc4a71b806a96a947a0c8ac2ee7308ef8827d86e150abeac89d6e1c479bc993d6298004a272889a5344a5436fa41247819ddaea4601ed324a0f3c9f3ef02585475e4e8ccd867a54965f6bba730c8d2c6be41f49d031e64a12c3cbd43d6b6207e7225033d531c10bfaf1f00e99d31e29ec7bba528ff14cd7c5680d17423b03ed85227855ccbb66887b458a3c0db18beafdce45869bd196b2f9c189222fbf1085b677bb6d6d3ea64fac7c3dee6319da08fcaa7d7571fe3e1e97394d9f58330ae4711f3a659c640f6dfb2a463a31df23a8a7db04cf6ff4414646a93f28b4e0d211159c71ec0475cc803bfff2a236dfeff05b8989e77452e351a45142c1df57a5c15ca3360616b15c999231696f5eff454de2207574a27e53b1278998d2698dff2620a48f898490c6cf1396c08684c2a1e89898525836afb1558d8c271fc486889413c688d7bd8ac4e570916005eb4de3a46d98314015669553c5d37be1497d10e49ec74058890b85af1dc206bef8d9b191f35dd421240c8a95f1ce9d54ca967cb6b953e3d9fb059f781ccb28c665519fcbde60999de4d9f2608121c521cdf6fa2a3959bee598f10af1f792cd8d0f0f16ae1f63cb6edbb6ddf4732721b0bd68bf457b4d8b926b0e398590d0be226f67c6dba2208ba30b8470a3cecdf48b88de140300797c6b1035dba01eb3217f7837072af9a45a6a8f7e3ae42fb22889b41606ef11d324e8bbaa8ce71cc5d06dec4f0bea732c784649c929434db1de6c3fb60f03ea5e569c9532502db04c45d89b77e0543ddcaa25dfd434de0970b4bea4340c11ea233c52c0e1a57105bbf75de34563536507836df9c9dd785cd5fdeb761b6a11a80a8969dcdef5b781c37975acc35a43432ff8a3032a1defb1fadba94dcc1e101affdfced89bb13c5cd3a2dc32327d49f3f49ddb22ce1fa25ec1057dc0d93ffe4c3c7250d77b465e9d9601a15caa5bad0ad095f3ac0bb43d2ad8fa26309bf4b0a14853b2267de31ca4fb00681afe7d7c0998b516ec05f57a69e5b4ca2a43a5397b44135af98d62808f63e545bd254838aa3ec586d7a2b60e4c520b83df7ea2e68659b460142183efa98c2ec6fded84a45111423c7c8014719dbd3477d7770a0ab6b751c43853a200e71bf846829c2a83ed9988c2b8687f1e564603df23de119f92b17f66ebdac9a88f6bf3df99ff08f69c0147dec17b9b017521fc542953782d99ccad056c7732b21f6450784e49c230df3af6d33f6640b8fcc0f6672360684197f6d0b3902bb1fdccc4911c429f96b84fa7bd34cbca467ebf6a93e2b8c5323858b1f662aad82315955bbdb24de061b9323da36c8fe4b4f56ec70f92ac2bb836b910b216d76b713e24cd8c360590739f5ec05045c25f4d6ebb03755b1411e84b6c10a0a02052ef709aa862858a240d4dc73220a5a1906dc31c77dea511c2cdcdbdf80dce776eb6e9f00c394c92cc4b24be2e1304860196399b31c26904430a4e178aad37ce20a43bbfe497075ec0f205fb3243b689f15fd56679a69cfb2ca1dbd093943ee41abe719e69919094d3caef523aa1fe1ddd6672df3a43bf6407a1006b233600ad850e2b8beae2386c05c48c50bfec3cb5a3cee51135fe4d2fa613e7712a609a1f8a282c719ff22a8e06ca6d950cf4441ce62ba27e52ff7e5b8c846dcd14ae4f9140c6c174feaf4445b0d9fa12273c703ba5895eedb7c69eee995db46d32c26fbd27dacaade1bd99ba62219b8474b23110b41ac0f8ebc6726d812f53f7523db90a682a254b47c1b6cb4db7e01ca2c82e72914165254d9f2d20fb024b5c277321d366e8c133152b13abad9682a174304560aab419e5451145444e7f4dadd5b4288ffe0cdec41e2871e724c1a5e094b64c8dfeab936b25c89c52ad50cbd681bf7382054faf3dc4ed2258f37e44a1bc3907a093cf458f7ec45b0968c3c6fc76be268d6d0953878d5c8515a7750ef25ec67a714a27c82fc62819e1ee0cc0a13c4af5c7dd8b221770f5417df7d1e0c1493f2a5c0786014303b92cd8449f6c97a8ddf7361a2ed2cc766ad474e7fea15ccdcd0bb21c9f229553c4d37860a4b580a739963a6c8b560e5ad76062bb00aaa59c59ddd26a928e2493ac9f170bb108e315314cdea7046be432f0917c1533d090736946ff9e84e2c1d5b9cce56a433d5fd8eff1816e48b8fd6404750a377a628b979159c1f7238842e49b6d7dc327bb096b1a84d24b30563d813bd6f58ca306eed9e3bf359cdb176b10b6632cc9ae9fcb896a33bf1d928a19526237ff2d28c76e26e4cfa62d7b60ee9bd6088ad2ada3b837024897da75e09a692ff35ef6e169a39dbcd2e82550826f9a73ff7ba5198e8431cab28124c57ecb6e9d26b53baf61f86ecf4a5badc6144efaa7795002d9042f265f63b4dc10fdbcf22ae20e5892239769baf54aa825a9189b7572d005ab9219f7c7debb4e17dc886eb810589334121acce0a8de5a25b7f6b2734973829f828acfcbc6b8781e97d70ef23c2a892e8884aebce3fe77f8e62011d3bf1de0836e4e98a8516a651dd65bb5fd6884e1821cc4627c76f1abf6d4f31e4812f3fd5f586d0f37f65b1af5bcd11dc4c257db0d3e4d8d9406497490737e675cd2abf24d95f20622cf2a7e02b7db2c4e60c8ae228e0f94ba71241b70acf090c930096719016a8327ece80512f953bbf3221d58849619003a894d735d96b99ac60d7d41040168e8a3b2a2c971b44da500c806719fb7f88bed958c922b54b20ce1968c3ccbf011a1173cef6a4794fac69f64e4924c25d71e456be0a6ae379b73d6f6c28f488696948e29e4cab0fc5eae090f02b49115aa5942c9a491ae8d8b4f3138ce2b6766abab933069e941b1af0baa61c29e7e394e0df47558e216fa619424f9535cf99db1555d2bb46167e1b78074c11590df870bcc3c6907e43e841d58ee423d72aea7c76b93ff9506484c5b6803db22c92f9e4a54d1f8d39af1c45b9838eb08651e2529b3f792db9a714e18f65a1b5045db74ed4fa938e6d34da0245b26e305282da50789ab43b04f7206a0d103f841cd8bfb8fd436bdc2f6936217b6c02fe991f020d28abd5d7bc802a2c1e3efc819f64d2ba52e9f095fe317714106a2bbd804af26d4da4ff5f64842257a95807aa9b9c31bde386d66d145cd392b898ad7b5400fec2961adc33f227c101adb2b63b6f98356cb9adc9c1c00ef593af1f8f39afcbeff09ebc95c68b98c8519f06b2a034e1bb6285d410a19bca8fd98ba6cdba870b1a9e96b3d5fa52a00f1ac377dc003457bfe19c5bc06dfde561cf5580e8656340fe114990ad5e9a7da2bce8e8343b581c0ce833cd529cd232235b213af906c638de83cd06bd0a0241212881363e2d4292ee3095cdc671ba7dab51285b8eb6f7be2515b53d19cb0ccff0d819bf8b9f8085f0888003cb8b0c340053b1f70cc5d2593703e751a38ac27f37651d61addf73f450634bdd963dea578b7d086c33825b2463fd7523316234831672d2c9465f4be1e234ef1d229721afe36df6aa712a50312cc80ddf022f6426568ae81c84ea20b2bcfcd42cc0982477dca9e966ae2695d81842180ef1710c15b850eec79d0d329cec6ffe1328f82a816bcf8fad8583bf824e08786d33ebcf02ca15de2b7ac37d6d66250032989f96008277b67201066b890b78ec67f8b46be99bb6e18d536de6b2faa4ea3015b0a8391081640b754baeac4eb3051f8734ac7590f535bb35c28d2b31921c213dcdf8a76994f185ab2b2fa64a55f4b1b996366935748d4ac476790c6d55fa0ae37c439358ab4719b70c2fff42bc99c142dfea398b1f0e85592e8ca7e5b7e76c8e30d49d9df97b825c69e3617cbfdfdbebac6510de7dd259d9438deb1c1dd2df50961b4289c5b7c2c7e00c82ea58e2b304a397eda21e27a2f5a5c5d9ce04a9ef613958ca9337e266789a2fb9422fb708a40cb64800f392c1e02a6562e7a30ee7bb2f1eb82513829938114f5f28fa2663c5c722b70f7252cedd440b2cac08536f1676f8359e19367afb5b1d6bf471a4ad84d76aee58b3b81d23dc42f","sig":"52ff6eb4a46e879479f7f2242bf10d64275d4b1103ef51dea7666b39c3125e62f5d1f31079a2d79df87e1c392a92bcd71296c1cf0455bf087bd2d8dbf1b80f8a","pk":[212,53,147,199,21,253,211,28,97,20,26,189,4,169,159,214,130,44,133,88,133,76,205,227,154,86,132,231,165,109,162,125],"recip":[10,192,41,240,184,83,178,59,237,101,45,109,13,230,155,124,195,141,148,249,55,50,238,252,133,181,134,30,144,247,58,34],"a":[196,247,218,11,167,239,127,176,132,224,1,111,64,113,89,136,37,216,225,138,14,182,130,117,167,154,23,110,129,128,210,115],"nonce":[162,200,2,73,48,179,118,109,92,226,226,222]}'
    // handles error if kvdb is full or not
    try {
      await thresholdServer.sendKeys([mock], [LOCAL_SERVER])
      throw new Error('should have failed gracefully')
    } catch (e: any) {
      if (e.response.data == 'Not Registering error: Register Onchain first') {
        assert.equal(
          e.response.data,
          'Not Registering error: Register Onchain first'
        )
      } else {
        assert.equal(e.response.data, 'Kv error: Recv Error: channel closed')
      }
    }
  })

  it(`sends a successful evm transaction request to the threshold server`, async () => {
    const unsignedTx = exampleUnsignedEvmTx()
    const serializedUnsignedTx = ethers.utils.serializeTransaction(unsignedTx)
    const evmTransactionRequest: ITransactionRequest = {
      arch: Arch.Evm,
      transaction_request: serializedUnsignedTx,
    }

    try {
      await thresholdServer.submitTransactionRequest(evmTransactionRequest, [
        LOCAL_SERVER,
      ])

    } catch (e: any) {
      // fails due to no transaction in kvdb
      assert.equal(e.response.status, 424)
    }
  })

  // This is used to for mocking the interface between the threshold server and the client
  it.skip(`print an example Evm TransactionRequest from a serialized UnsignedTransaction`, async () => {
    const testAccount = ethers.Wallet.createRandom()

    const unsignedTx = exampleUnsignedEvmTx()
    console.info(`exampleUnsignedEvmTx:\n${JSON.stringify(unsignedTx)}\n`)

    const serializedUnsignedTx = ethers.utils.serializeTransaction(unsignedTx)
    console.info(`serializedUnsignedTx:\n${serializedUnsignedTx}\n`)

    // this is the same hash the server should derive from serializedUnsignedTx
    const unsignedTxHash = ethers.utils.keccak256(serializedUnsignedTx)
    console.info(`unsignedTxHash:\n${unsignedTxHash}\n`)

    // print an example of a signed transaction
    const signedTx = await testAccount.signTransaction(unsignedTx)
    const parsedTx = ethers.utils.parseTransaction(signedTx)
    console.info(`signedTx:\n${JSON.stringify(parsedTx)}\n`)

    // this is the object the server should receive
    const evmTransactionRequest: ITransactionRequest = {
      arch: Arch.Evm,
      transaction_request: serializedUnsignedTx,
    }
    console.info(
      `evmTransactionRequest:\n${JSON.stringify(evmTransactionRequest)}\n`
    )
  })
})
