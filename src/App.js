import React, { useState, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const App = () => {
	const [data, setData] = useState([]);
	const [options, setOptions] = useState({
		chart: {
			type: "line",
		},
		title: {
			text: "Tokyo and London Monthly Temperature",
		},
		xAxis: {
			categories: [],
		},
		yAxis: {
			title: {
				text: "Temperature (°C)",
			},
		},
		legend: {
			enabled: false,
		},
		tooltip: {
			backgroundColor: "#FCFFC5",
			borderColor: "black",
			borderRadius: 10,
			borderWidth: 3,
			crosshairs: true,
			style: {
				color: "#333333",
				cursor: "default",
				fontSize: "12px",
				whiteSpace: "nowrap",
			},
			shared: false,
			enabled: true,
		},
		plotOptions: {
			series: {
				label: {
					connectorAllowed: false,
				},
			},
		},
		series: [],
	});

	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const getTotalMonthCount = function (arrayData) {
		let totalMonthCount = 0;
		let name = arrayData[0].city;
		for (let i = 0; i < arrayData.length - 1; i++) {
			if (name === arrayData[i].city) totalMonthCount++;
			else break;
		}
		return totalMonthCount;
	};

	const segregateDataByCityName = function (arrayData) {
		const cities = {};
		for (let i = 0; i < arrayData.length; i++) {
			if (!cities[arrayData[i].city])
				cities[arrayData[i].city] = [parseFloat(arrayData[i].value)];
			else cities[arrayData[i].city].push(parseFloat(arrayData[i].value));
		}
		return cities;
	};

	const getSeries = function (segData) {
		const series = [];

		for (let key in segData) {
			series.push({ name: key, data: segData[key] });
		}
		return series;
	};

	useEffect(() => {
		fetch(
			"https://rmimgblob.blob.core.windows.net/interviewdata/SampleRockData.json"
		)
			.then((response) => response.json())
			.then((data) => {
				const monthsToShow = months.slice(0, getTotalMonthCount(data));
				const series = getSeries(segregateDataByCityName(data));
				setOptions({
					...options,
					xAxis: {
						categories: monthsToShow,
					},
					series,
				});
				setData(data);
			});
	}, []);

	return (
		<div>
			{!data.length ? (
				<div style={{ textAlign: "center" }}>Loding...</div>
			) : (
				<HighchartsReact highcharts={Highcharts} options={options} />
			)}
		</div>
	);
};

export default App;
