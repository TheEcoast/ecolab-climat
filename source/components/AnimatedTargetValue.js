/* @flow */
import withLanguage from 'Components/utils/withLanguage'
import React, { Component, PureComponent } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './AnimatedTargetValue.css'

type Props = {
	value: ?number,
	language: string
}
type State = {
	difference: number
}
export default withLanguage(
	class AnimatedTargetValue extends Component<Props, State> {
		previousValue: ?number = null
		timeoutId: ?TimeoutID = null
		state = { difference: 0 }

		componentDidUpdate(prevProps) {
			if (prevProps.value === this.props.value) {
				return
			}
			if (this.timeoutId) {
				clearTimeout(this.timeoutId)
			}
			this.previousValue =
				this.previousValue === null ? prevProps.value : this.previousValue

			this.timeoutId = setTimeout(() => {
				this.setState({
					difference: (this.props.value || 0) - (this.previousValue || 0)
				})
				this.previousValue = null
				this.timeoutId = null
			}, 200)
		}
		format = value => {
			return value == null
				? ''
				: Intl.NumberFormat(this.props.language, {
						style: 'currency',
						currency: 'EUR',
						maximumFractionDigits: 0,
						minimumFractionDigits: 0
				  }).format(value)
		}
		render() {
			const formattedValue = this.format(this.props.value)
			const formattedDifference = this.format(this.state.difference)
			return (
				<>
					<span key={this.props.value} className="Rule-value">
						{Math.abs(this.state.difference) > 1 &&
							formattedDifference !== formattedValue && (
								<Evaporate
									style={{
										color: this.state.difference > 0 ? 'chartreuse' : 'red'
									}}>
									{(this.state.difference > 0 ? '+' : '') + formattedDifference}
								</Evaporate>
							)}{' '}
						<span>{this.format(this.props.value)}</span>
					</span>
				</>
			)
		}
	}
)

class Evaporate extends PureComponent<{ children: string, style: Object }> {
	render() {
		return (
			<ReactCSSTransitionGroup
				transitionName="evaporate"
				transitionEnterTimeout={1000}
				transitionLeaveTimeout={1}>
				<span
					key={this.props.children}
					style={this.props.style}
					className="evaporate">
					{this.props.children}
				</span>
			</ReactCSSTransitionGroup>
		)
	}
}
