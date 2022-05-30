// will remove the empty key
const removeEmptyKey = (data) => {
	const newData = { ...data };
	Object.keys(newData).forEach((key) => {
		if (typeof newData[key] === "string") newData[key] = newData[key].trim();
		if (typeof newData[key] !== "boolean" && !newData[key]) delete newData[key];
	});

	return newData;
};

export default removeEmptyKey;
