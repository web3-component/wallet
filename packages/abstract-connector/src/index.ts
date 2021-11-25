import { EventEmitter } from 'events'
import { AbstractConnectorArguments, ConnectorUpdate, ConnectorEvent } from '@web3-component/types'

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class NoProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No provider was found.'
  }
}

export abstract class AbstractConnector extends EventEmitter {
  public readonly supportedChainIds?: number[]

  constructor({ supportedChainIds }: AbstractConnectorArguments = {}) {``
    super()
    this.supportedChainIds = supportedChainIds
  }

  public abstract activate(): Promise<ConnectorUpdate>
  public abstract getProvider(): Promise<any>
  public abstract getChainId(): Promise<number | string>
  public abstract getAccount(): Promise<null | string>
  public abstract deactivate(): void

  protected emitUpdate(update: ConnectorUpdate): void {
    console.log(`Emitting '${ConnectorEvent.Update}' with payload`, update)
    this.emit(ConnectorEvent.Update, update)
  }

  protected emitError(error: Error): void {
    console.log(`Emitting '${ConnectorEvent.Error}' with payload`, error)
    this.emit(ConnectorEvent.Error, error)
  }

  protected emitDeactivate(): void {
    console.log(`Emitting '${ConnectorEvent.Deactivate}'`)
    this.emit(ConnectorEvent.Deactivate)
  }
}