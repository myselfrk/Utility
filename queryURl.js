import { stringify, parse } from "query-string";
import { history } from "../history";
import removeEmptyKey from "./removeEmptyKey";

// will make query string of nested object

const queryURL = {
	queryString: (data) => {
		const clonedData = removeEmptyKey(data);
		Object.keys(clonedData).forEach((key) => (clonedData[key] = JSON.stringify(clonedData[key])));
		return stringify(clonedData);
	},
	parseString: (string) => {
		try {
			const clonedData = parse(string);
			Object.keys(clonedData).forEach((key) => (clonedData[key] = JSON.parse(clonedData[key])));
			return clonedData;
		} catch (err) {
			history.goBack();
		}
	},
};

export default queryURL;
