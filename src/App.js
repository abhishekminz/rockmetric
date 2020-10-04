import React, { useState, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const App = () => {
	const [data, setData] = useState([]);
	const [lineOption, setLineOption] = useState({
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
	const [barOption, setBarOption] = useState({
		chart: {
			type: "bar",
		},
		title: {
			text: "Tokyo and London monthly temperature",
		},
		subtitle: {
			text:
				'Source: <a href="https://en.wikipedia.org/wiki/World_population">Wikipedia.org</a>',
		},
		xAxis: {
			categories: [],
			title: {
				text: null,
			},
		},
		yAxis: {
			min: 0,
			title: {
				text: "Temperature (°C)",
				align: "high",
			},
			labels: {
				overflow: "justify",
			},
		},
		tooltip: {
			valueSuffix: "(°C)",
		},
		legend: {
			enabled: false,
		},
		credits: {
			enabled: false,
		},
		series: [],
	});

	const monthNames = [
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

	const segregateData = function (arrayData) {
		const cities = {};
		const months = {};
		let monthCount = 0;
		for (let i = 0; i < arrayData.length; i++) {
			if (!cities[arrayData[i].city]) {
				cities[arrayData[i].city] = [parseFloat(arrayData[i].value)];
				monthCount = 0;
			} else {
				cities[arrayData[i].city].push(parseFloat(arrayData[i].value));
			}
			if (!months[monthNames[monthCount]]) {
				months[monthNames[monthCount]] = [parseFloat(arrayData[i].value)];
			} else {
				months[monthNames[monthCount]].push(parseFloat(arrayData[i].value));
			}
			monthCount++;
		}
		return { dataByCityName: cities, dataByMonthName: months };
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
				const monthCount = getTotalMonthCount(data);
				const monthsToShow = monthNames.slice(0, monthCount);
				const { dataByCityName, dataByMonthName } = segregateData(data);
				const lineSeries = getSeries(dataByCityName);
				const barSeries = getSeries(dataByMonthName);
				const cityNames = Object.keys(dataByCityName);
				console.log(cityNames, barSeries);
				setLineOption({
					...lineOption,
					xAxis: {
						categories: monthsToShow,
					},
					series: lineSeries,
				});
				setBarOption({
					...barOption,
					xAxis: {
						categories: cityNames,
						title: {
							text: null,
						},
					},
					series: barSeries,
				});
				setData(data);
			});
	}, []);

	return (
		<div>
			{!data.length ? (
				<div style={{ textAlign: "center" }}>Loding...</div>
			) : (
				<React.Fragment>
					<div style={{ border: "1px solid red", marginBottom: "15px" }}>
						<HighchartsReact highcharts={Highcharts} options={lineOption} />
					</div>
					<div style={{ border: "1px solid red", marginBottom: "15px" }}>
						<HighchartsReact highcharts={Highcharts} options={barOption} />
					</div>
				</React.Fragment>
			)}
		</div>
	);
};

export default App;
