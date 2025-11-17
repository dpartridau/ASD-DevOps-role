import React, {useEffect, useState} from 'react'
import bitcoinImage from "./assets/Bitcoin.svg";
import './App.css'

const App: React.FC = (): JSX.Element => {
	const [count, setCount] = useState<number>(0);
	const [banked, setBanked] = useState<number>(0);

	const [error, setError] = useState<string>("");

	const handleClick = (): void => {
		setCount(c => c + 1);
	}

	const getBitcoins = (): void => {
		setError(() => "");
		fetch("/v1/bitcoins").then(async r => {
			const data = await r.text();
			if (!r.ok) {
				setError(() => data);
				return;
			}
			setBanked(() => Number(data));
		}).catch(err => setError(() => err.toString()));
	}

	const setBitcoins = (): void => {
		setError(() => "");
		fetch(`/v1/bitcoins?bitcoins=${count}`, {method: "POST"}).then(r => {
			if (r.ok) {
				setCount(() => 0);
				getBitcoins();
				return "";
			}
			return r.text();
		}).then(r => setError(() => r)).catch(err => setError(() => err.toString()));
	}

	useEffect(() => {
		getBitcoins();
	}, []);

	return (
		<div className="App">
			<div>
				<div
					onClick={handleClick}>
					<img src={bitcoinImage} className="logo" alt="React logo" />
				</div>
			</div>
			<h1>{count}</h1>
			<div className="card">
				<button
					onClick={setBitcoins}>
					Bank BitCoin
				</button>
			</div>
			<pre className={"error"}>
				{error}
			</pre>
			<p className="read-the-docs">
				Banked BitCoin: {banked}
			</p>
		</div>
	)
}
export default App;
