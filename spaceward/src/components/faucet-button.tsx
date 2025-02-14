import { useState } from "react";
import { env } from "@/env";
import { useAddressContext } from "@/def-hooks/addressContext";
import { Button } from "@/components/ui/button";

async function getFaucetTokens(addr: string) {
	await fetch(env.faucetURL, {
		method: "POST",
		body: JSON.stringify({ address: addr }),
	});
}

function FaucetButton() {
	const [loading, setLoading] = useState(false);
	const { address } = useAddressContext();

	const getTokens = async () => {
		setLoading(true);
		await getFaucetTokens(address);
		setLoading(false);
	};

	return (
		<Button
			disabled={loading}
			onClick={() => getTokens()}
			className="w-full"
		>
			GET WARD
		</Button>
	);
}

export default FaucetButton;
