import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-component/types'
import { AbstractConnector } from '@web3-component/abstract-connector'
// https://github.com/NoahZinsmeister/web3-react/blob/v6/packages/injected-connector/src/index.ts
export class NoEthereumProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Ethereum provider was found on window.ethereum.'
  }
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class InjectedConnector extends AbstractConnector {
  constructor(kwargs: AbstractConnectorArguments) {
    super(kwargs)

    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
  }

  private handleChainChanged(chainId: string | number): void {
    console.log("Handling 'chainChanged' event with payload", chainId)
    this.emitUpdate({ chainId, provider: window.ethereum })
  }

  private handleAccountsChanged(accounts: string[]): void {
    console.log("Handling 'accountsChanged' event with payload", accounts)
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleDisconnect(code: number, reason: string): void {
    console.log("Handling 'disconnect' event with payload", code, reason)
    this.emitDeactivate()
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    if (window.ethereum.on) {
      window.ethereum.on('chainChanged', this.handleChainChanged)
      window.ethereum.on('accountsChanged', this.handleAccountsChanged)
      window.ethereum.on('disconnect', this.handleDisconnect)
    }

    if ((window.ethereum as any).isMetaMask) {
      ;(window.ethereum as any).autoRefreshOnNetworkChange = false
    }

    let account
    try {
      [account] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new UserRejectedRequestError()
      }
      console.warn('eth_requestAccounts was unsuccessful', error)
    }

    return { provider: window.ethereum, ...(account ? { account } : {}) }
  }

  public async getProvider(): Promise<any> {
    return window.ethereum
  }

  public async getChainId(): Promise<number | string> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    let chainId
    try {
      chainId = await window.ethereum.request({
        method: 'eth_chainId'
      })
    } catch (error) {
      console.warn('eth_chainId was unsuccessful', error)
    }

    return chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!window.ethereum) {
      throw new NoEthereumProviderError()
    }

    let account
    try {
      [account] = await window.ethereum.request({
        method: 'eth_accounts'
      })
    } catch (error) {
      console.warn('eth_accounts was unsuccessful', error)
    }

    return account
  }

  public deactivate(): void {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('chainChanged', this.handleChainChanged)
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
      window.ethereum.removeListener('close', this.handleDisconnect)
    }
  }

  public async isAuthorized(): Promise<boolean> {
    if (!window.ethereum) {
      return false
    }

    try {
      const account = await window.ethereum.request({
        method: 'eth_accounts'
      })
      return account && account.length > 0
    } catch {
      return false
    }
  }
}
