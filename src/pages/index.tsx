import Head from "next/head";
import React from "react";
import AnimeCover from "@/components/anime-cover";
import Image from "next/image";
import Link from "next/link";

import { Jikan } from "@/lib/jikan";
import { GetStaticProps } from "next/types";
import { JikanPreview, JikanResponse } from "@/lib/jikan/types";
import { ArrowRight } from "lucide-react";

const Home: React.FC<{
	airing: JikanPreview[];
	popular: JikanPreview[];
	upcoming: JikanPreview[];
}> = ({ airing, popular, upcoming }) => {
	return (
		<>
			<Head>
				<title>Anime Analytics</title>
			</Head>

			<div className="flex flex-col">
				<div className="flex justify-center pt-4">
					<Image className="rounded-full" src="/logo.png" alt="logo" width={100} height={100} />
				</div>

				<div className="grid grid-rows-3 gap-y-3 pb-5">
					<div className="w-11/12 m-auto flex flex-col gap-y-2 max-w-[1280px] md:w-2/3">
						<h1 className="font-bold text-2xl text-center md:text-left dark:text-aa-3">Airing Animes</h1>
						<div className="flex flex-col gap-y-2 bg-aa-1 p-5 rounded-md dark:bg-aa-dark-1">
							<div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
								{airing.map((anime, idx) => {
									return (
										<AnimeCover key={idx} image={anime.image} name={anime.title} href={`/animes/${anime.mal_id}`} />
									);
								})}
							</div>

							<Link
								className="flex justify-center items-center gap-x-2 text-sm font-semibold md:justify-end hover:text-aa-4 dark:hover:text-aa-3"
								href="/animes?type=airing"
							>
								Show More
								<ArrowRight className="hidden md:block" />
							</Link>
						</div>
					</div>
					<div className="w-11/12 m-auto flex flex-col gap-y-2 max-w-[1280px] md:w-2/3">
						<h1 className="font-bold text-2xl text-center md:text-left dark:text-aa-3">Popular Animes</h1>
						<div className="flex flex-col gap-y-2 bg-aa-1  p-5 rounded-md dark:bg-aa-dark-1">
							<div className="grid grid-cols-2 gap-2 rounded-md md:grid-cols-4 lg:grid-cols-6">
								{popular.map((anime, idx) => {
									return (
										<AnimeCover key={idx} image={anime.image} name={anime.title} href={`/animes/${anime.mal_id}`} />
									);
								})}
							</div>

							<Link
								className="flex justify-center items-center gap-x-2 text-sm font-semibold md:justify-end hover:text-aa-4 dark:hover:text-aa-3"
								href="/animes?type=popular"
							>
								Show More
								<ArrowRight className="hidden md:block" />
							</Link>
						</div>
					</div>
					<div className="w-11/12 m-auto flex flex-col gap-y-2 max-w-[1280px] md:w-2/3">
						<h1 className="font-bold text-2xl text-center md:text-left dark:text-aa-3">Upcoming Animes</h1>
						<div className="flex flex-col gap-y-2 bg-aa-1 p-5 rounded-md dark:bg-aa-dark-1">
							<div className="grid grid-cols-2 gap-2 rounded-md md:grid-cols-4 lg:grid-cols-6">
								{upcoming.map((anime, idx) => {
									return (
										<AnimeCover key={idx} image={anime.image} name={anime.title} href={`/animes/${anime.mal_id}`} />
									);
								})}
							</div>

							<Link
								className="flex justify-center items-center gap-x-2 text-sm font-semibold md:justify-end hover:text-aa-4 dark:hover:text-aa-3"
								href="/animes?type=upcoming"
							>
								Show More
								<ArrowRight className="hidden md:block" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
	let airingAnimes: JikanResponse;
	let popularAnimes: JikanResponse;
	let upcomingAnimes: JikanResponse;

	const jikan = new Jikan();
	// show the top airing, top animes, and top upcoming animes
	const sections = await Promise.all([
		jikan.getTopAnimes("tv", "airing"),
		jikan.getTopAnimes("tv", "bypopularity"),
		jikan.getTopAnimes("tv", "upcoming"),
	]);

	airingAnimes = sections[0];
	popularAnimes = sections[1];
	upcomingAnimes = sections[2];

	// limit the amount of data is being sent
	// only need the first 12 of each
	const airing: JikanPreview[] = airingAnimes.data
		.filter((anime, idx) => idx < 12)
		.map(({ title, mal_id, images }) => {
			return { title, mal_id, image: images.webp.image_url };
		});
	const popular: JikanPreview[] = popularAnimes.data
		.filter((anime, idx) => idx < 12)
		.map(({ title, mal_id, images }) => {
			return { title, mal_id, image: images.webp.image_url };
		});
	const upcoming: JikanPreview[] = upcomingAnimes.data
		.filter((anime, idx) => idx < 12)
		.map(({ title, mal_id, images }) => {
			return { title, mal_id, image: images.webp.image_url };
		});

	return {
		props: {
			airing,
			popular,
			upcoming,
			revalidate: 86400,
		},
	};
};
