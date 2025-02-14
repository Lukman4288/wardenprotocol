import { Button } from "./ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Label } from "./ui/label";
import useSpaceAddress from "@/hooks/useSpaceAddress";
import useKeychainAddress from "@/hooks/useKeychainAddress";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddressContext } from "@/def-hooks/addressContext";
import useWardenWarden from "@/hooks/useWardenWarden";
import KeyRequestDialog from "./key-request-dialog";
import useRequestKey from "@/hooks/useRequestKey";

const FormSchema = z.object({});

function NewKeyButton() {
	const { address } = useAddressContext();
	const [keychainAddress, setKeychainAddress] = useKeychainAddress();
	const [spaceAddress, _] = useSpaceAddress();

	const { state, error, keyRequest, requestKey, reset } = useRequestKey();

	const { QueryKeychains } = useWardenWarden();
	const q = QueryKeychains({}, {}, 10);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	return (
		<>
			<KeyRequestDialog
				state={state}
				error={error}
				keyRequest={keyRequest}
				reset={reset}
			/>

			<Sheet>
				<SheetTrigger>
					<Button>Create key</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>New key</SheetTitle>
					</SheetHeader>

					<div className="grid gap-4 py-4">
						<Form {...form}>
							<div className="flex flex-col gap-4">
								<FormField
									control={form.control}
									name="keychain"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Keychain</FormLabel>
											<Select
												onValueChange={(value) =>
													field.onChange(
														setKeychainAddress(
															value
														)
													)
												}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a keychain" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{q.data?.pages.flatMap(
														(page) => (
															page.keychains?.map((kr) => (
																<SelectItem key={kr.address} value={kr.address!} >
																	{kr.description}
																</SelectItem>
															))
														))}
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
								{/* <Select
								onValueChange={() =>
									setKeychainAddress(e.target.value)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select Keychain" />
								</SelectTrigger>
								<SelectContent>
									{q.data?.keychains.map((kr) => (
										<SelectItem value={kr.address}>
											{kr.description}
										</SelectItem>
									))}
								</SelectContent>
							</Select> */}
								<Label htmlFor="description">Chain</Label>
								<Select
								// onChange={(e) =>
								// 	setKeychainAddress(e.target.value)
								// }
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Chain" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ethereum-sepolia">
											Ethereum Sepolia
										</SelectItem>
										<SelectItem value="celestia-testnet">
											Celestia Testnet
										</SelectItem>
										<SelectItem value="sui-testnet">
											Sui Testnet
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</Form>
					</div>

					<SheetFooter>
						<SheetClose asChild>
							<Button
								type="submit"
								disabled={!keychainAddress || !spaceAddress}
								onClick={() =>
									requestKey(
										keychainAddress!,
										address,
										spaceAddress!
									)
								}
							>
								Create
							</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</>
	);
}

export default NewKeyButton;
