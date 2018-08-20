// @flow
import React from 'react'
import classNames from 'classnames'

import Panel from '../../Panel'
import styles from './TokenBalancesPanel.scss'
import {
  toFixedDecimals,
  formatToRoundedShortNumber
} from '../../../core/formatters'

import { CURRENCIES } from '../../../core/constants'

type Props = {
  className: ?string,
  balances: Array<TokenBalanceType>,
  prices: Object,
  currencyCode: string
}

export default class TokenBalancesPanel extends React.Component<Props> {
  static defaultProps = {
    loading: false
  }

  render = () => {
    const { className, balances } = this.props
    return (
      <Panel
        className={classNames(styles.tokenBalancesPanel, className)}
        renderHeader={this.renderHeader}
      >
        <div className={styles.tokenBalancesPanelContent}>
          <div className={styles.tableHeader}>
            <div className={styles.symbol}>Ticker</div>
            <div className={styles.name}>Token</div>
            <div className={styles.priceLabel}>Price</div>
            <div className={styles.balance}>Holdings</div>
          </div>
          {balances.sort(this.sortByValueInPortfolio).map(this.renderToken)}
        </div>
      </Panel>
    )
  }

  formatPrice = (ticker: string): string => {
    const { prices, currencyCode } = this.props
    const { symbol } = CURRENCIES[currencyCode]
    let currPriceOfToken
    if (prices) currPriceOfToken = prices[ticker]
    if (!currPriceOfToken) return 'N/A'
    return `${symbol}${toFixedDecimals(currPriceOfToken, 4)}`
  }

  sortByValueInPortfolio = (
    a: TokenBalanceType,
    b: TokenBalanceType
  ): number => {
    const { prices } = this.props
    if (prices) {
      let aValue = 0
      if (prices[a.symbol]) {
        aValue = prices[a.symbol] * Number(a.balance)
      }
      let bValue = 0
      if (prices[b.symbol]) {
        bValue = prices[b.symbol] * Number(b.balance)
      }

      if (aValue > bValue) return -1
      if (aValue < bValue) return 1
      return 0
    }
    return 0
  }

  renderHeader = () => (
    <div className={styles.header}>
      <span>Token Balances</span>
    </div>
  )

  renderToken = (token: TokenBalanceType) => (
    <div key={token.scriptHash} className={styles.tableData}>
      <div className={styles.tickerName}>
        {!!token.image && (
          <div className={styles.tokenImageContainer}>
            <img className={styles.tokenImage} src={token.image} alt="" />
          </div>
        )}
        {token.symbol}
      </div>
      <div className={styles.tokenName}>{token.name}</div>
      <div className={styles.price}>{this.formatPrice(token.symbol)}</div>
      <div className={styles.balanceValue}>
        {formatToRoundedShortNumber(Number(token.balance))}
      </div>
    </div>
  )
}