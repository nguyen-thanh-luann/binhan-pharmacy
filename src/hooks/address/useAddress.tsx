
import { userAPI } from "@/services";
import { AddressId, WardAddress } from "@/types";
import { useEffect, useState } from "react";
 
interface UseAddressRes {
	getWards: (id: number) => void;
	getDistricts: (id: number) => void;
	states: AddressId[] | undefined;
	districts: AddressId[] | undefined;
	wards: WardAddress[] | undefined;
	clearDistricts: Function;
	clearWards: Function;
	clearAddressList: Function;
	setDistricts: Function;
	setWards: Function;
}

export const useAddress = (): UseAddressRes => {
	const [states, setStates] = useState<AddressId[]>();
	const [districts, setDistricts] = useState<AddressId[]>();
	const [wards, setWards] = useState<WardAddress[]>();

	useEffect(() => {
		getStates();
	}, []);

	const getDistricts = (state_id: number) => {
		userAPI.getAddress({ state_id }).then((res: any) => setDistricts(res.result?.data || []));
	};

	const getStates = () => {
		userAPI.getAddress({}).then((res: any) => setStates(res.result?.data || []));
	};

	const getWards = (district_id: number) => {
		userAPI.getAddress({ district_id }).then((res: any) => setWards(res.result?.data || []));
	};

	const clearAddressList = () => {
		setDistricts(undefined);
		setStates(undefined);
		setWards(undefined);
	};

	const clearDistricts = () => {
		setDistricts(undefined);
	};

	const clearWards = () => {
		setWards(undefined);
	};

	return {
		getWards,
		getDistricts,
		states,
		districts,
		wards,
		clearDistricts,
		clearWards,
		clearAddressList,
		setDistricts,
		setWards,
	};
};
