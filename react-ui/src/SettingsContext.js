import React, {useState, createContext} from 'react';

export const SettingsContext = createContext()

export const SettingsProvider = props => {
	const [settings, setSettings] = useState({alert: 10});
	return (
		<SettingsContext.Provider settings="test">
			{props.childern}
		</SettingsContext.Provider>
	);

}
