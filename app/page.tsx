import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import { MovieCard } from "@/components/MovieCard";

export default function Home() {
  const trendingMovies = [
    {
      title: "Echoes of Time",
      genre: "Sci-Fi",
      year: "2023",
      quality: "4K",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAbP3qL3hTUq3iERZkUGZLdxwqOlmjVhplLfEE8qI1GLCh-AXmEJ7zYgEK6yTseuZ3ulP_Y9yMF4uYwx2vo2WN0Y81oc2Wc5q8OmvFHTRRkT30bAO198-WltC_yVQUuAZpCBhSQnkmK9uCgchWwqyzXinuE3JtWjHzhyPRPzWF3Y5aNJsWRX-37FuGfgMq78Ci-74zYzZr0qZOMdfuKtdzoiUMUjXvpXNcIartWOjRyAQZ7K_VHYtV9ztn-o7qHqnK3cm2zpUQwQ"
    },
    {
      title: "Neon Nights",
      genre: "Thriller",
      year: "2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6BPgDRqQPlWYBdNtifhSLha6zsRkbb2hYlwDDUboD23ptBYZXlgkFP1JKS_Lyx2UD5K_-f7jYB5wWgf8flHadFe4-XQoQIYyJERxs7B7P7Q1DIKuxqzdpAlWDYfRjxYGyF60VYxaSXf9nGg_vmpzok62KAMHbK26UlUHDW5ekeuLGo4r6N5Fr-CClPXurb8rLq2q2Fp0m6fO6BbCrn7_xw2hGxnNXb6O_GRDRlclYtUCejELJvAINiZHgshVmcpucsvrhGQK77w"
    },
    {
      title: "System Failure",
      genre: "Action",
      year: "2023",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH4JlWrWoSkVoXpB4MD2hxxCHF8mu-u0JRjkVeioiM709OYh2EqosskclIZIglksc5j-5_aXjsaX6w1jSNzpyxxPBG_SHPxvQTAVDiWGlEwGwsbUUOaUGqyUXI9HuGmSpJ3bVztaurFZxAxfMzcI_5GA3SfhR_NhQcZD0X3DDNZQk5IRPUwFehU46BQwQ5QjlFfVPh6i5pWdLeg9dIQzMD74eDgE8YC0hENwrxAkhlrOcDzlUg6V449mlAOOmfR7ir4HjmUQpdNw"
    },
    {
      title: "The Mist",
      genre: "Horror",
      year: "2022",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEgAO0I-MF2msK_nEix9JqQBI3aU4M6jVo-V_mxrQI0QXFtDrMsQlDo6ZkFR0-wA-1MSka_6vp-4w4hT6vdLzEhvNXaGj4Cu_4rCc44FlLmfVRZLxj2fLY12Z-HLq_TrKBB9HAVgYaixMd7UeHRrHTvKKj0rYLtv9cijDU8VkamdieOzBP3IV5KxyXDsRWwXWOrTmReMjYyhpXzdLMu8Nyl-2CYg7Y6WH9zzfFzJ8AyQmiI-9h-eq2jx77bn8KHPMREY9-0JvZjQ"
    },
    {
      title: "Void State",
      genre: "Drama",
      year: "2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE47eAsnloR__i_MJe5W7auAhAfTF2-ur638EeofgrFDGWhxY_45-FFuDU9UacMWcUy0W62argGa1TSc6QnHYhKCQD1hCK-N_z0idv1z_CyJxY5J_02o7fNQUjR2ibTKsJ1LsKGssUQdD_SMvz55MDRawbYuGfm-uDdnzgd8El9Gk1wFAmsTDiFezDUGpnOgMnU2owjTS6NVD6ljU-lhmn6AdRize3ksApARa9sNExWR98sV4g4fNJBs671g9qxM755NyTuEbXuw"
    }
  ];

  const topRecs = [
    {
      title: "Blade Runner 2049",
      genre: "", year: "",
      description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF_1LStHxQuQTv1LmnYKXk8jj4en4-AhKbnQkg5SsSgFpoBFK5n6p7vS4NAFOTn0G6Ker0LKP0ZbdG4pkvDYUse9rRla2z9ZOLdQ2bDs33qHGKnlDSDElxLlJ3Mr0jP0TNwc1VgJ-_L9a8SH8M1el95a_3m7RDoQZgBhs6YoCUNy5Kjx5-AVb2B-Hl9QA2IFxYa35jgD5-9nCAsx1FuHXI6kSnfwAntgy_N3NieUa4xmR9DVFQewZEfOxFxWZKd-onvq7UoCBtmA"
    },
    {
      title: "Interstellar",
      genre: "", year: "",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0edm1kbp3uAlKsXMrMH3Aga7NV6mjDQYlw_8KZjaUKG9GH_EzFQefCEWXR5AQCT3gw8lEIzi6HCpIRRJNB-UkAjhJGPmAWvsXgQ374N6N76h6j1VSTpBZorxNq90yBi3KlJn-KVBdJDyDIl83bB0yGbPMjC5b46l5o6fsRJCH5Vf4kuojGd8El766vx-v6G9HbMpAVPYtjjz9QQkGxdQ3ZkDecvlg6xCcwy-nWgcEwpVr4gl06CAbtDjduQBsUArYd5AZbK23ng"
    },
    {
      title: "The Matrix",
      genre: "", year: "",
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGIrlYSy00C6bwYveakz04mh7COu57Z226i-1x-IPZEHND4H3KL0olFLshdlaOBs0JclJEWEog2AqMM3ui1JWOQmgoeGIk6uQm5LZHHZDM1w6dGBuwxOrt8Tia6c3bYOKMNYRCq_QVWrL_aHzxxpuexFxfJRpsNseAi3NkPwCYO4vMZB2xOydeXSczHXc4aZqe1SsNJ4rcr-KtETep568pf-6ItalgFld4uq2iGn_E3iG-3hatXHZ5CjQCBFGP7E4YR9ItJUhVMQ"
    }
  ];

  return (
    <>
      <HeroSection />

      <div className="z-10 relative flex flex-col gap-12 -mt-10 px-8">
        <MovieRow title="Trending Now" viewAllLink="#">
          {trendingMovies.map((movie, index) => (
            <MovieCard key={index} {...movie} />
          ))}
        </MovieRow>

        <MovieRow title="Top Recommendations">
          {topRecs.map((movie, index) => (
            <MovieCard key={index} {...movie} isRec={true} />
          ))}
        </MovieRow>
      </div>
    </>
  );
}
