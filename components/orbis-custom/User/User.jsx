import React, { useState, useEffect } from "react";
import { shortAddress, sleep } from "../../../utils";
import { decryptString } from "@orbisclub/orbis-sdk";
import { Badge as VerificationBadge, Check } from "lucide-react";

/** Internal components */
import ConnectButton from "../ConnectButton";
import Button from "../Button";
import Input from "../Input";
import Badge from "../Badge";
import Alert from "../Alert";
import UpdateProfileModal from "../ProfileModal";

import {
	LoadingCircle,
	CheckIcon,
	EditIcon,
	LogoutIcon,
	TwitterIcon,
	GithubIcon,
	GoogleIcon,
	OpenSeaIcon,
	UniswapIcon,
	TheGraphIcon,
	SushiIcon,
	HopIcon,
	LidoIcon,
	SnapshotIcon,
	SismoIcon,
	EthereumIcon,
	PolygonIcon,
	ArbitrumIcon,
	OptimismIcon,
	X2Y2Icon,
	LooksRareIcon,
	EmailCredentialIcon,
	LockOpen,
	Lock,
} from "../../Icons";
import useHover from "../../../hooks/useHover";
import useDidToAddress from "../../../hooks/useDidToAddress";
import useGetUsername from "../../../hooks/useGetUsername";
import { useOrbis } from "@orbisclub/components";
import { defaultTheme, getThemeValue, getStyle } from "../../../utils/themes";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userProfileSchema } from "../../../constants/schema";

/** Import CSS */
import styles from "./User.module.css";
import useUserProfile from "../../../hooks/useUserProfile";
import clsx from "clsx";
import Error from "../../Error";

/** Full component for a user */
const User = ({
	did,
	details,
	connected = false,
	height = 44,
	hover = false,
}) => {
	const [userDetails, setUserDetails] = useState(details);
	const { user, orbis } = useOrbis();
	const { verified: usernameVerified } = useGetUsername({
		profile: user?.profile,
		address: user?.metadata?.address,
		did: user?.did,
	});

	/** This will retrieve user details in case a did is passed instead of the full user details */
	useEffect(() => {
		if (did) {
			loadProfile();
		}

		async function loadProfile() {
			let { data, error } = await orbis.getProfile(did);
			setUserDetails(data?.details);
		}
	}, [did]);

	return (
		<div className={styles.userContainer}>
			<UserPfp
				height={height}
				details={connected ? user : userDetails}
				hover={hover}
			/>
			<div className={styles.userUsernameContainer}>
				<div style={{ display: "flex" }}>
					<Username
						details={connected ? user : userDetails}
						verified={usernameVerified}
					/>
				</div>
			</div>
		</div>
	);
};

/** Export only the User Pfp */
export const UserPfp = ({
	details,
	height = 44,
	showBadge = true,
	hover = false,
	showEmailCta = false,
}) => {
	const { user, theme } = useOrbis();
	const [hoverRef, isHovered] = useHover();

	return (
		<div className={styles.userPfpContainer} ref={hoverRef}>
			{details && details.profile && details.profile?.pfp ? (
				<img
					className={styles.userPfpContainerImg}
					src={details.profile.pfp}
					alt=""
					style={{ height: height, width: height }}
				/>
			) : (
				<span
					className={styles.userPfpContainerImgEmpty}
					style={{
						height: height,
						width: height,
						background: theme?.bg?.tertiary
							? theme.bg.tertiary
							: defaultTheme.bg.tertiary,
						color: theme?.color?.tertiary
							? theme.color.tertiary
							: defaultTheme.color.tertiary,
					}}
				>
					<svg
						style={{ width: "100%", height: "100%" }}
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
				</span>
			)}

			<div
				style={{
					top: -4,
					right: -5,
					position: "absolute",
					display: "flex",
					flexDirection: "col",
				}}
			>
				{showEmailCta &&
					user &&
					user.did == details.did &&
					!details?.encrypted_email && (
						<svg
							width="18"
							height="18"
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M0.25 10C0.25 4.61522 4.61522 0.25 10 0.25C15.3848 0.25 19.75 4.61522 19.75 10C19.75 15.3848 15.3848 19.75 10 19.75C4.61522 19.75 0.25 15.3848 0.25 10ZM10 6.25C10.4142 6.25 10.75 6.58579 10.75 7V10.75C10.75 11.1642 10.4142 11.5 10 11.5C9.58579 11.5 9.25 11.1642 9.25 10.75V7C9.25 6.58579 9.58579 6.25 10 6.25ZM10 14.5C10.4142 14.5 10.75 14.1642 10.75 13.75C10.75 13.3358 10.4142 13 10 13C9.58579 13 9.25 13.3358 9.25 13.75C9.25 14.1642 9.58579 14.5 10 14.5Z"
								fill="#FF3162"
							/>
						</svg>
					)}
				{showBadge &&
					details &&
					details.profile &&
					details.profile?.pfpIsNft && (
						<>
							<img
								style={{ height: "1.25rem", width: "1.25rem" }}
								src={
									"https://app.orbis.club/img/icons/nft-verified-" +
									details.profile?.pfpIsNft.chain +
									".png"
								}
							/>
						</>
					)}
			</div>

			{/** If requested show more details on hover */}
			{hover && <UserPopup visible={isHovered} details={details} />}
		</div>
	);
};

export const UsernameVerificationBadge = () => (
	<span className="relative inline-block h-fit w-fit">
		<VerificationBadge className="w-5 h-5 stroke-0 fill-blue-500" />
		<Check className="h-3 w-2 stroke-[4px] stroke-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
	</span>
);

/** Export only the Username */
export const Username = ({ details }) => {
	const { address } = useDidToAddress(details?.did);
	const { username, verified } = useGetUsername({
		profile: details?.profile,
		address,
		did: details?.did,
	});

	if (verified) {
		return (
			<span className="flex gap-1 items-center w-fit">
				{username}
				<UsernameVerificationBadge />
			</span>
		);
	}
	return username;
};

/** Export only the Badge */
export const UserBadge = ({ details }) => {
	const { theme } = useOrbis();
	const { address, chain } = useDidToAddress(details?.did);
	if (address) {
		return (
			<div
				className={styles.userBadge}
				style={{
					...getThemeValue("badges", theme, "main"),
					...getThemeValue("font", theme, "badges"),
				}}
			>
				{details?.metadata?.ensName
					? details.metadata.ensName
					: shortAddress(address)}
			</div>
		);
	} else {
		return null;
	}
};

/** Modal appearing on request with more details about a specific user */
export const UserPopup = ({ details, visible, position = "absolute" }) => {
	const { orbis, user, setUser, theme } = useOrbis();
	const [locked, setLocked] = useState(false);
	const [vis, setVis] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [pfp, setPfp] = useState(details?.profile?.pfp);
	const [pfpNftDetails, setPfpNftDetails] = useState(
		details?.profile?.pfpIsNft
	);

	const { verified: usernameVerified } = useGetUsername({
		profile: user?.profile,
		address: user?.metadata?.address,
		did: user?.did,
	});

	useEffect(() => {
		if (locked == false) {
			setVis(visible);
		}
	}, [visible]);

	function _setIsEditing(vis) {
		setIsEditing(vis);
		setLocked(vis);
	}

	function callbackNftUpdate(url, details) {
		setPfp(url);
		setPfpNftDetails(details);
	}

	async function logout() {
		let res = orbis.logout();
		setUser(null);
	}

	if (vis == false) {
		return null;
	}

	return (
		<div className={styles.userPopupContainer} style={{ position: position }}>
			<div
				className={styles.userPopupContent}
				style={{
					background: theme?.bg?.secondary
						? theme.bg.secondary
						: defaultTheme.bg.secondary,
					borderColor: theme?.border?.main
						? theme.border.main
						: defaultTheme.border.main,
				}}
			>
				{/** Show form if editing or profile details */}
				{isEditing ? (
					<UserEditProfile
						setIsEditing={_setIsEditing}
						setShowProfileModal={setShowProfileModal}
						pfp={pfp}
						pfpNftDetails={pfpNftDetails}
					/>
				) : (
					<>
						{/** Top part with CTA and profile picture */}
						<div className={styles.userPopupTopDetailsContainer}>
							<UserPfp details={details} hover={false} />
							<div className={styles.userPopupDetailsContainer}>
								<span
									className={styles.userPopupDetailsUsername}
									style={{
										color: getThemeValue("color", theme, "main"),
										...getThemeValue("font", theme, "main"),
									}}
								>
									<Username details={details} verified={usernameVerified} />
								</span>
								<span className={styles.userPopupDetailsBadgeContainer}>
									<UserBadge details={details} />
								</span>
							</div>
							<div className={styles.userPopupDetailsActionsContainer}>
								{user && user.did == details.did ? (
									<>
										<Button color="primary" onClick={() => _setIsEditing(true)}>
											Edit
											<EditIcon className="ml-2" />
										</Button>
										<span
											style={{
												marginLeft: 7,
												cursor: "pointer",
												color: getThemeValue("color", theme, "main"),
											}}
											onClick={() => logout()}
										>
											<LogoutIcon />
										</span>
									</>
								) : (
									<FollowButton did={details.did} />
								)}
							</div>
						</div>

						{/** Show alert if user never added email address */}
						{user && user.did == details.did && !user.encrypted_email && (
							<Alert
								title={<AddEmailAddress />}
								style={{
									backgroundColor: getThemeValue("bg", theme, "main"),
									color: getThemeValue("color", theme, "main"),
									borderColor: "#FF3162",
									marginTop: 12,
								}}
							/>
						)}

						{/** Display description if available part */}
						{details?.profile?.description && (
							<div style={{ marginTop: "0.5rem" }}>
								<p
									style={{
										...getThemeValue("font", theme, "secondary"),
										lineHeight: "inherit",
										color: getThemeValue("color", theme, "secondary"),
									}}
								>
									{details.profile.description}
								</p>
							</div>
						)}

						{/** On-chain credentials */}
						<UserCredentials details={details} />

						{/** Third part */}
						<div className={styles.userPopupFooterContainer}>
							{/** Followers */}
							<div
								className={styles.userPopupFooterFollowers}
								style={{
									borderColor: theme?.border?.main
										? theme.border.main
										: defaultTheme.border.main,
								}}
							>
								<p
									className={styles.userPopupFooterFollowTitle}
									style={{
										...getThemeValue("font", theme, "main"),
										fontWeight: 400,
										fontSize: 13,
										color: getThemeValue("color", theme, "secondary"),
									}}
								>
									Followers
								</p>
								<p
									className={styles.userPopupFooterFollowCount}
									style={{
										...getThemeValue("font", theme, "secondary"),
										fontSize: 15,
										color: getThemeValue("color", theme, "main"),
									}}
								>
									{details.count_followers}
								</p>
							</div>

							{/** Following */}
							<div className={styles.userPopupFooterFollowing}>
								<p
									className={styles.userPopupFooterFollowTitle}
									style={{
										...getThemeValue("font", theme, "main"),
										fontWeight: 400,
										fontSize: 13,
										color: getThemeValue("color", theme, "secondary"),
									}}
								>
									Following
								</p>
								<p
									className={styles.userPopupFooterFollowCount}
									style={{
										...getThemeValue("font", theme, "secondary"),
										fontSize: 15,
										color: getThemeValue("color", theme, "main"),
									}}
								>
									{details.count_following}
								</p>
							</div>
						</div>
					</>
				)}
			</div>

			{/** Show ConnectModal */}
			{showProfileModal && (
				<UpdateProfileModal
					hide={() => setShowProfileModal(false)}
					callbackNftUpdate={callbackNftUpdate}
				/>
			)}
		</div>
	);
};

/** Component with the email address field and respective loading state */
const AddEmailAddress = () => {
	const { orbis, user, setUser, theme } = useOrbis();
	const [email, setEmail] = useState("");
	const [savingEmail, setSavingEmail] = useState(false);

	/** Will encrypt the email and save in Ceramic */
	async function saveEmail() {
		if (!email || email == "") {
			alert("Email is required.");
			return;
		}
		setSavingEmail(true);
		let res = await orbis.setEmail(email);
		console.log("res:", res);
		if (res.status == 200) {
			let _user = { ...user };
			_user.encrypted_email = res.encryptedEmail;
			console.log("_user:", _user);
			setUser(_user);
			setSavingEmail(false);
		}
	}

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<p
				style={{
					...getThemeValue("font", theme, "secondary"),
					fontSize: 13,
					marginTop: 0,
					marginBottom: 8,
					textAlign: "center",
					color: getThemeValue("color", theme, "secondary"),
				}}
			>
				Add your email address to receive notifications for replies and
				mentions.
			</p>
			<div
				style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
			>
				<Input
					type="text"
					name="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={savingEmail}
					placeholder="Your email address"
					style={{
						...getStyle("input", theme, savingEmail),
						marginTop: "0rem",
						width: "auto",
						flex: 1,
						marginRight: 8,
					}}
				/>
				{savingEmail ? (
					<Button color="secondary">
						<LoadingCircle />
					</Button>
				) : (
					<Button color="secondary" onClick={() => saveEmail()}>
						Save
					</Button>
				)}
			</div>
		</div>
	);
};

/** Load and display credentials for this user */
function UserCredentials({ details }) {
	const { orbis, user, theme } = useOrbis();
	const [credentials, setCredentials] = useState([]);
	const [credentialsLoading, setCredentialsLoading] = useState(false);

	useEffect(() => {
		loadCredentials();
	}, []);

	/** Load credentials for this user with Orbis SDK */
	async function loadCredentials() {
		setCredentialsLoading(true);
		let { data, error, status } = await orbis.api.rpc(
			"get_verifiable_credentials",
			{
				q_subject: details.did,
				q_min_weight: 10,
			}
		);

		setCredentials(data);
		setCredentialsLoading(false);
	}

	const LoopCredentials = () => {
		if (credentials && credentials.length > 0) {
			return credentials.map((credential, key) => {
				return <UserCredential credential={credential} key={key} />;
			});
		} else {
			return (
				<>
					<Alert
						title="User doesn't have any credentials yet."
						style={{
							width: "100%",
							backgroundColor: getThemeValue("bg", theme, "main"),
							color: getThemeValue("color", theme, "main"),
						}}
					/>
				</>
			);
		}
	};

	return (
		<div style={{ marginTop: 15, marginBottom: 15 }}>
			<p
				className={styles.userPopupFooterFollowTitle}
				style={{
					...getThemeValue("font", theme, "main"),
					fontWeight: 400,
					fontSize: 13,
					color: theme?.color?.secondary
						? theme.color.secondary
						: defaultTheme.color.secondary,
				}}
			>
				Credentials:
			</p>
			<div className={styles.userPopupCredentialsContainer}>
				{credentialsLoading ? (
					<div
						className={styles.loadingContainer}
						style={{ color: getThemeValue("color", theme, "main") }}
					>
						<LoadingCircle />
					</div>
				) : (
					<LoopCredentials />
				)}
			</div>
		</div>
	);
}

/** Display one credential */
export function UserCredential({ credential, showTooltip = true }) {
	const { theme } = useOrbis();

	function clean(str) {
		if (str) {
			return str.toLowerCase().replaceAll(" ", "").replaceAll("-", "_");
		}
	}

	const CredentialIcon = () => {
		let protocol = credential.content?.credentialSubject?.protocol;
		if (protocol) {
			switch (clean(protocol)) {
				case "opensea":
					return <OpenSeaIcon />;
				case "uniswap":
					return <UniswapIcon />;
				case "thegraph":
					return <TheGraphIcon />;
				case "lido":
					return <LidoIcon />;
				case "sushiswap":
					return <SushiIcon />;
				case "hop":
					return <HopIcon />;
				case "snapshot":
					return <SnapshotIcon />;
				case "sismo":
					return <SismoIcon />;
				case "x2y2":
					return <X2Y2Icon />;
				case "looksrare":
					return <LooksRareIcon />;
				case "email":
					return <EmailCredentialIcon />;
				case "nonces":
					switch (credential.content?.credentialSubject?.type) {
						case "active-wallet-mainnet":
							return <EthereumIcon />;
						case "active-wallet-polygon":
							return <PolygonIcon />;
						case "active-wallet-arbitrum":
							return <ArbitrumIcon />;
						case "active-wallet-optimism":
							return <OptimismIcon />;
						default:
							return null;
					}
				case "evm":
					switch (credential.content?.credentialSubject?.type) {
						case "active-wallet-mainnet":
							return <EthereumIcon />;
						case "active-wallet-polygon":
							return <PolygonIcon />;
						case "active-wallet-arbitrum":
							return <ArbitrumIcon />;
						case "active-wallet-optimism":
							return <OptimismIcon />;
						default:
							return null;
					}
				default:
					return null;
			}
		} else {
			return null;
		}
	};

	/** Orbis credentials */
	if (
		credential.content &&
		credential.issuer ==
			"did:key:z6mkfglpulq7vvxu93xrh1mlgha5fmutcgmuwkz1vuwt3qju"
	) {
		if (
			credential.content.credentialSubject.protocol == "nonces" ||
			credential.content.credentialSubject.protocol == "EVM"
		) {
			return (
				<Badge
					style={{
						...getStyle(
							"badge",
							theme,
							clean(credential.content.credentialSubject.type)
						),
						...getThemeValue("font", theme, "badges"),
					}}
					tooltip={
						showTooltip
							? credential.content.credentialSubject.description
							: null
					}
				>
					<CredentialIcon />
					{credential.content.credentialSubject.name}
				</Badge>
			);
		} else {
			return (
				<Badge
					style={getStyle(
						"badge",
						theme,
						clean(credential.content?.credentialSubject.protocol)
					)}
					tooltip={
						showTooltip
							? credential.content.credentialSubject.description
							: null
					}
				>
					<CredentialIcon />
					{credential.content.credentialSubject.name}
				</Badge>
			);
		}
	} else if (
		/** Gitcoin credentials */
		credential.issuer ==
		"did:key:z6mkghvghlobledj1bgrlhs4lpgjavbma1tn2zcryqmyu5lc"
	) {
		return (
			<Badge style={{ backgroundColor: "#FFF" }}>
				<GitcoinProvider credential={credential} />
			</Badge>
		);
	}
}

const GitcoinProvider = ({ credential }) => {
	/** Default provider */
	let provider = (
		<div className="verified-credential-type">
			<span>{credential.content?.credentialSubject?.provider}</span>
		</div>
	);

	/** Num Gitcoin Grants contributed to */
	if (
		credential.content?.credentialSubject?.provider.includes(
			"GitcoinContributorStatistics#numGrantsContributeToGte#"
		)
	) {
		let numGrantsContributeTo =
			credential.content?.credentialSubject?.provider.replace(
				"GitcoinContributorStatistics#numGrantsContributeToGte#",
				""
			);
		provider = (
			<div className="verified-credential-type">
				<span className="inline-block break-word">
					Contributed to at least{" "}
					<span className="primary bold mleft-3">{numGrantsContributeTo}</span>
					<span>
						<img
							src="/img/icons/gitcoin-logo.png"
							height="19"
							className="mleft-3 mright-4"
						/>{" "}
						grants
					</span>
				</span>
			</div>
		);
	}

	/** Value contribution Grants total */
	if (
		credential.content?.credentialSubject?.provider.includes(
			"GitcoinContributorStatistics#totalContributionAmountGte#"
		)
	) {
		let totalContributionAmountGte =
			credential.content?.credentialSubject?.provider.replace(
				"GitcoinContributorStatistics#totalContributionAmountGte#",
				""
			);
		provider = (
			<div className="verified-credential-type">
				<span className="inline-block break-word">
					Contributed more than{" "}
					<span className="primary bold mleft-3">
						{totalContributionAmountGte} ETH to{" "}
					</span>
					<span>
						<img
							src="/img/icons/gitcoin-logo.png"
							height="19"
							className="mleft-3 mright-4"
						/>{" "}
						grants
					</span>
				</span>
			</div>
		);
	}

	/** Num Gitcoin Rounds contributed to */
	if (
		credential.content?.credentialSubject?.provider.includes(
			"GitcoinContributorStatistics#numRoundsContributedToGte#"
		)
	) {
		let numRoundsContributedToGte =
			credential.content?.credentialSubject?.provider.replace(
				"GitcoinContributorStatistics#numRoundsContributedToGte#",
				""
			);
		provider = (
			<div className="verified-credential-type">
				<span className="inline-block break-word">
					Contributed to at least{" "}
					<span className="primary bold mleft-3">
						{numRoundsContributedToGte}{" "}
					</span>
					<span>
						<img
							src="/img/icons/gitcoin-logo.png"
							height="19"
							className="mleft-3 mright-4"
						/>{" "}
						rounds
					</span>
				</span>
			</div>
		);
	}

	/** Num Gitcoin contributions for GR14 to */
	if (
		credential.content?.credentialSubject?.provider.includes(
			"GitcoinContributorStatistics#numGr14ContributionsGte#"
		)
	) {
		let numGr14ContributionsGte =
			credential.content?.credentialSubject?.provider.replace(
				"GitcoinContributorStatistics#numGr14ContributionsGte#",
				""
			);
		provider = (
			<div className="verified-credential-type">
				<span className="inline-block break-word">
					Contributed to at least{" "}
					<span className="primary bold mleft-3">
						{numGr14ContributionsGte}{" "}
					</span>
					<span>
						<img
							src="/img/icons/gitcoin-logo.png"
							height="19"
							className="mleft-3 mright-4"
						/>{" "}
						grant(s) in GR14
					</span>
				</span>
			</div>
		);
	}

	/** Amount of Twitter followers GT */
	if (
		credential.content?.credentialSubject?.provider.includes(
			"TwitterFollowerGT"
		)
	) {
		let countTwitterFollowers =
			credential.content?.credentialSubject?.provider.replace(
				"TwitterFollowerGT",
				""
			);
		provider = (
			<>
				<TwitterIcon style={{ marginRight: 4, color: "#1DA1F2" }} />
				<span>
					Followers <span className="primary bold">{` > `}</span>{" "}
					{countTwitterFollowers}
				</span>
			</>
		);
	}

	/** Amount of Twitter followers GTE */
	if (
		credential.content?.credentialSubject?.provider.includes(
			"TwitterFollowerGTE"
		)
	) {
		let countTwitterFollowersGte =
			credential.content?.credentialSubject?.provider.replace(
				"TwitterFollowerGTE",
				""
			);
		provider = (
			<>
				<TwitterIcon style={{ marginRight: 4, color: "#1DA1F2" }} />
				<span>
					Followers <span className="primary bold">{` > `}</span>{" "}
					{countTwitterFollowersGte}
				</span>
			</>
		);
	}

	/** Amount of tweets */
	if (
		credential.content?.credentialSubject?.provider.includes("TwitterTweetGT")
	) {
		let countTweets = credential.content?.credentialSubject?.provider.replace(
			"TwitterTweetGT",
			""
		);
		provider = (
			<>
				<TwitterIcon style={{ marginRight: 4, color: "#1DA1F2" }} />
				<span>
					Tweets <span className="primary bold">{` > `}</span> {countTweets}
				</span>
			</>
		);
	}

	/** GTC possession */
	if (
		credential.content?.credentialSubject?.provider.includes(
			"gtcPossessionsGte"
		)
	) {
		let countGtc = credential.content?.credentialSubject?.provider.replace(
			"gtcPossessionsGte#",
			""
		);
		provider = (
			<>
				<span>
					Owns at least <span className="primary bold">{countGtc}</span>
				</span>
				<img
					src="/img/icons/gtc-logo.webp"
					height="15"
					className="mright-4 mleft-4"
				/>
				<span className="primary bold">GTC</span>
			</>
		);
	}

	switch (credential.content?.credentialSubject?.provider) {
		/** User has a Twitter account */
		case "Twitter":
			provider = (
				<>
					Has a{" "}
					<TwitterIcon
						style={{ marginLeft: 3, marginRight: 3, color: "#1DA1F2" }}
					/>{" "}
					account
				</>
			);
			break;

		/** User has a Github account */
		case "Github":
			provider = (
				<>
					Has a <GithubIcon style={{ marginLeft: 3, marginRight: 3 }} /> account
				</>
			);
			break;

		/** Has starred Github repository */
		case "StarredGithubRepoProvider":
			provider = (
				<>
					Has stars on <GithubIcon style={{ marginLeft: 3, marginRight: 3 }} />{" "}
					repositories
				</>
			);
			break;

		/** Has more than 10 followers */
		case "TenOrMoreGithubFollowers":
			provider = (
				<>
					Has at least 10{" "}
					<GithubIcon style={{ marginLeft: 3, marginRight: 3 }} /> followers
				</>
			);
			break;

		/** Has forked Github repositories */
		case "ForkedGithubRepoProvider":
			provider = (
				<>
					Forked some <GithubIcon style={{ marginLeft: 3, marginRight: 3 }} />{" "}
					repositories
				</>
			);
			break;

		/** User has more than 5 Github repositories */
		case "FiveOrMoreGithubRepos":
			provider = (
				<>
					Owns at least <span className="primary bold">5</span>{" "}
					<GithubIcon style={{ marginLeft: 3, marginRight: 3 }} /> repositories
				</>
			);
			break;

		/** User has a Proof of Humanity */
		case "Poh":
			provider = <>Human on Proof of Humanity</>;
			break;

		/** User has an ENS name */
		case "Ens":
			provider = <>Has an ENS name</>;
			break;

		/** User has a Discord account */
		case "Discord":
			provider = (
				<>
					Has a{" "}
					<img
						src="/img/icons/discord-logo.png"
						height="17"
						className="mleft-4 mright-4"
					/>{" "}
					account
				</>
			);
			break;

		/** User has a Linkedin account */
		case "Linkedin":
			provider = (
				<>
					Has a{" "}
					<img
						src="/img/icons/linkedin-logo.png"
						height="17"
						className="mleft-4 mright-4"
					/>{" "}
					account
				</>
			);
			break;

		/** User has a Google account */
		case "Google":
			provider = (
				<>
					Has a <GoogleIcon style={{ marginLeft: 3, marginRight: 3 }} /> account
				</>
			);
			break;

		/** User has an Facebook account */
		case "Facebook":
			provider = (
				<div className="verified-credential-type">
					<span className="inline-block break-word">
						Has a{" "}
						<img
							src="/img/icons/facebook-logo.png"
							height="17"
							className="mleft-4 mright-4"
						/>{" "}
						account
					</span>
				</div>
			);
			break;

		/** User has an Facebook profile picture */
		case "FacebookProfilePicture":
			provider = (
				<div className="verified-credential-type">
					<span className="inline-block break-word">
						Has a{" "}
						<img
							src="/img/icons/facebook-logo.png"
							height="17"
							className="mleft-4 mright-4"
						/>{" "}
						profile picture
					</span>
				</div>
			);
			break;

		/** User has an Facebook account */
		case "Brightid":
			provider = (
				<div className="verified-credential-type">
					<span className="inline-block break-word">
						Verified on{" "}
						<img
							src="/img/icons/brightid-logo.png"
							height="17"
							className="mleft-4 mright-4"
						/>
					</span>
				</div>
			);
			break;

		/** Wallet with more than one transaction */
		case "EthGTEOneTxnProvider":
			provider = (
				<div className="verified-credential-type">
					<span className="inline-block break-word">
						Wallet with{" "}
						<span className="primary bold mleft-4 mright-4">{` >= 1 `}</span>{" "}
						Txn
					</span>
				</div>
			);
			break;

		/** Wallet owns more than 1 ETH */
		case "ethPossessionsGte#1":
			provider = (
				<div className="verified-credential-type">
					<span className="inline-block break-word">
						Wallet with{" "}
						<span className="primary bold mleft-4 mright-4">{` >= 1 `}</span>{" "}
						ETH
					</span>
				</div>
			);
			break;

		/** Voted on Snapshot */
		case "SnapshotVotesProvider":
			provider = (
				<div className="verified-credential-type">
					<span className="inline-block break-word">
						Voted on{" "}
						<span className="primary bold mleft-4 mright-4">{`Snapshot`}</span>
					</span>
				</div>
			);
			break;
	}

	return provider;
};

/** Follow button component */
export function FollowButton({ did }) {
	const { orbis, user, theme } = useOrbis();
	const [loading, setLoading] = useState(false);
	const [following, setFollowing] = useState(false);
	const [followHoverRef, isFollowHovered] = useHover();

	/** Will check if user connected is already following this did */
	useEffect(() => {
		if (user) {
			getFollowing();
		}
		async function getFollowing() {
			setLoading(true);
			let { data, error } = await orbis.getIsFollowing(user.did, did);
			if (data) {
				setFollowing(data);
			}
			setLoading(false);
		}
	}, [user, did]);

	/** Will follow / unfollow the user  */
	async function follow(active) {
		setLoading(true);
		let res = await orbis.setFollow(did, active);

		/** Update status according to result from Orbis SDK */
		switch (res.status) {
			case 200:
				setFollowing(active);
				break;
			default:
				console.log("Error following user: ", res);
				break;
		}

		/** Remove loading state */
		setLoading(false);
	}

	/** Returns loading state */
	if (loading) {
		return (
			<Button color="green">
				<LoadingCircle />
			</Button>
		);
	}

	if (following) {
		return (
			<div ref={followHoverRef}>
				{isFollowHovered ? (
					<Button color="red">Unfollow</Button>
				) : (
					<>
						<Button color="green-transparent">
							<CheckIcon
								color={getThemeValue("color", theme, "green")}
								style={{ marginRight: "0.25rem" }}
							/>
							Following
						</Button>
					</>
				)}
			</div>
		);
	}

	return (
		<Button color="green" onClick={() => follow(true)}>
			Follow
		</Button>
	);
}

/** Form to update user profile */
function UserEditProfile({
	setIsEditing,
	setShowProfileModal,
	pfp,
	pfpNftDetails,
}) {
	const { user, theme } = useOrbis();
	const [email, setEmail] = useState("");

	const { XOauthLinkMutation, saveProfileMutation } = useUserProfile();
	const {
		mutate: save,
		isPending: saving,
		error: saveError,
	} = saveProfileMutation;
	const saved = !!saveProfileMutation.data;
	const errorMessage =
		saveError instanceof Error ? saveError.message : String(saveError);

	const { verified: usernameVerified, verifying: verifyingUsername } =
		useGetUsername({
			profile: user?.profile,
			address: user?.metadata?.address,
			did: user?.did,
		});

	const {
		control,
		register,
		handleSubmit,
		formState: { errors: formErrors, dirtyFields },
		watch,
	} = useForm({
		resolver: yupResolver(userProfileSchema),
		defaultValues: {
			username: user?.profile?.username ? user.profile.username : "",
			description: user?.profile?.description ? user.profile.description : "",
		},
	});
	const touched = !!Object.keys(dirtyFields).length;
	const formHasErrors = !!Object.keys(formErrors).length;

	useEffect(() => {
		if (user?.encrypted_email) {
			decryptEmail();
		}
		async function decryptEmail() {
			try {
				let _email = await decryptString(
					user.encrypted_email,
					"ethereum",
					localStorage
				);
				if (_email) {
					setEmail(_email.result);
				}
				console.log("Decrypted email:", _email);
			} catch (e) {
				console.log("Error decrypting email:", e);
				setEmail("•••••••••••••");
			}
		}
	}, [user]);

	const updateProfile = (v) =>
		save({
			data: { ...v, pfpNftDetails, pfp },
			onSave: () => setIsEditing(false),
		});

	return (
		<>
			<div className={styles.userEditContainer}>
				{/** Pfp */}
				<div className={styles.userEditPfpContainer}>
					<div style={{ position: "relative", width: 44, height: 44 }}>
						<UserPfp details={{ profile: { pfp: pfp } }} showBadge={false} />

						{/** Black overlay with edit CTA */}
						<div
							className={styles.userEditPfpOverlay}
							style={{
								background: "rgba(0,0,0,0.5)",
								top: 0,
								width: "100%",
								height: "100%",
							}}
							onClick={() => setShowProfileModal(true)}
						>
							<EditIcon />
						</div>
					</div>
				</div>

				<div
					className={styles.userEditButtonContainer}
					onClick={() => setIsEditing(false)}
				>
					<Button color="secondary">Cancel</Button>
				</div>
			</div>
			<form
				onSubmit={handleSubmit(updateProfile)}
				className={styles.userFieldsContainer}
			>
				<Controller
					control={control}
					name="username"
					render={({ field: { name, value = "", onChange, onBlur } }) => {
						const verificationLoading =
							XOauthLinkMutation.isPending || verifyingUsername;
						return (
							<div className="w-full mb-3">
								<Input
									type="text"
									name={name}
									value={value}
									onChange={onChange}
									onBlur={onBlur}
									// onChange={(e) => setUsername(e.target.value)}
									placeholder="Your username"
									style={getStyle("input", theme, saving)}
									className="lowercase"
								/>
								<Error message={formErrors[name]?.message} />
								{value && (
									<div
										target="_blank"
										className={clsx("mt-2 flex justify-end", {
											"pointer-events-none opacity-50":
												verificationLoading || usernameVerified,
										})}
									>
										<Button
											type="button"
											color={
												XOauthLinkMutation.data?.success || usernameVerified
													? "green"
													: "primary"
											}
											disabled={verificationLoading}
											onClick={() => XOauthLinkMutation.mutate(value)}
										>
											{verificationLoading ? (
												<>
													<LoadingCircle /> Loading
												</>
											) : usernameVerified ? (
												<>
													<Lock className="mr-2" />
													Username verified with X
												</>
											) : (
												<>
													<LockOpen className="mr-2" />
													Lock username with X
												</>
											)}{" "}
										</Button>
									</div>
								)}
							</div>
						);
					}}
				/>
				<Controller
					control={control}
					name="description"
					render={({ field: { name, value = "", onChange, onBlur } }) => {
						return (
							<Input
								type="textarea"
								name={name}
								value={value}
								onChange={onChange}
								onBlur={onBlur}
								// onChange={(e) => setDescription(e.target.value)}
								placeholder="Enter your description"
								style={{
									...getStyle("input", theme, saving),
									marginTop: "0.5rem",
								}}
							/>
						);
					}}
				/>
				{/** Display encrypted email if any */}
				{user.encrypted_email && (
					<p
						style={{
							...getThemeValue("font", theme, "secondary"),
							textAlign: "left",
							fontSize: 13,
							marginTop: 8,
							color: getThemeValue("color", theme, "secondary"),
						}}
					>
						<b>Email</b>: {email}{" "}
						{user.hasLit == false && (
							<span style={{ display: "inline-block" }}>
								<ConnectButton
									icon={null}
									title="Decrypt email"
									litOnly={true}
									style={{
										fontSize: 13,
										background: "transparent",
										boxShadow: "none",
										padding: 0,
										color: getThemeValue("color", theme, "active"),
									}}
								/>
							</span>
						)}
					</p>
				)}
				<div className={styles.userFieldsSaveContainer}>
					{/* <SaveButton /> */}
					<Button
						color={saved || !touched ? "green" : "primary"}
						className={clsx("w-full flex items-center justify-center", {
							"cursor-not-allowed": formHasErrors,
						})}
						disabled={formHasErrors || !touched}
					>
						{saving ? (
							<>
								<LoadingCircle />
								Saving
							</>
						) : saved || !touched ? (
							"Saved"
						) : (
							"Save"
						)}
					</Button>
				</div>
				{saveError && (
					<div className="text-center mt-2 text-red-500">{errorMessage}</div>
				)}
			</form>
		</>
	);
}

export default User;
