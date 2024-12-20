import { createContext, ReactNode, useContext, useState } from "react";

interface UserContextType {
	name: string;
	setName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [name, setName] = useState<string>('');

	return (
		<UserContext.Provider value={{ name, setName }}>
			{children}
		</UserContext.Provider>
	);
}

export const useUser = () => {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}

	return context;
}