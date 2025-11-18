import { motion } from "framer-motion";
import Image from "next/image";

import dashboard from "@/public/assets/images/feature1.webp";
import signup from "@/public/assets/images/feature2.webp";
import bentoFeatures from "@/public/assets/images/feature3.webp";
import preview from "@/public/assets/images/feature4.webp";


import { CheckIcon } from "lucide-react";
import { Badge } from "../ui/badge";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.6,
			staggerChildren: 0.2,
			delayChildren: 0.3,
		},
	},
};

const itemVariants = {
	hidden: {
		opacity: 0,
		y: 30,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: [0.6, -0.05, 0.01, 0.99],
		},
	},
};

const imageVariants = {
	hidden: {
		opacity: 0,
		scale: 0.8,
		y: 20,
	},
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: [0.6, -0.05, 0.01, 0.99],
		},
	},
};

const listVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.5,
		},
	},
};

const listItemVariants = {
	hidden: {
		opacity: 0,
		x: -20,
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.6,
			ease: [0.6, -0.05, 0.01, 0.99],
		},
	},
};

export const Features1 = () => {
  return (
    <section
      className="w-full bg-bgDark2 pt-24 -mt-8  mb-8 sm:-mt-8 sm:mb-24 xl:-mt-8 2xl:mt-0    md:pt-[12vw] lg:pt-16"
      id="features"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
      >
        <div className="flex flex-wrap items-center 2xl:w-[1450px] xl:w-[1300px] w-11/12 mx-auto md:pl-4 xl:pr-16 xl:pl-16">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <div className="mx-auto lg:mx-auto w-11/12 sm:w-4/5 md:w-3/4 lg:w-unset">
              <motion.div variants={itemVariants} className="block-subtitle">
                <Badge variant="secondary">Ship Faster</Badge>
              </motion.div>
              <motion.h2 variants={itemVariants} className="mt-6 mb-8 text-4xl lg:text-5xl block-big-title">
                Everything you need to build modern web apps
              </motion.h2>
              <motion.p variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }} className="mb-10 text-muted-foreground leading-loose">
                Launch your next idea faster with SupaNext Starter Kit 2 - a modern boilerplate
                powered by Next.js 16 and Supabase. Skip the setup headaches and focus on
                building features that matter.
              </motion.p>
              <motion.ul variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }} className="mb-6 text-foreground space-y-3">
                <motion.li variants={listItemVariants} className="flex items-center">
                  <CheckIcon className="size-4 mr-3 flex-shrink-0 text-green-500" />
                  <span>Complete authentication flow (sign up, sign in, password reset)</span>
                </motion.li>
                <motion.li variants={listItemVariants} className="flex items-center">
                  <CheckIcon className="size-4 mr-3 flex-shrink-0 text-green-500" />
                  <span>Dashboard with sidebar navigation and user management</span>
                </motion.li>
                <motion.li variants={listItemVariants} className="flex items-center">
                  <CheckIcon className="size-4 mr-3 flex-shrink-0 text-green-500" />
                  <span>Profile settings with theme toggle and password updates</span>
                </motion.li>
                <motion.li variants={listItemVariants} className="flex items-center">
                  <CheckIcon className="size-4 mr-3 flex-shrink-0 text-green-500" />
                  <span>CRUD operations template for project management</span>
                </motion.li>
                <motion.li variants={listItemVariants} className="flex items-center">
                  <CheckIcon className="size-4 mr-3 flex-shrink-0 text-green-500" />
                  <span>Next.js Cache Components for optimal performance</span>
                </motion.li>
              </motion.ul>
            </div>
          </div>
          <div className="w-full mx-auto lg:w-1/2 flex flex-wrap lg:-mx-4 sm:pr-8 lg:pt-10 justify-center lg:pl-4 xl:px-8">
            <div className="mb-8 lg:mb-0 w-full sm:w-1/2 px-2 lg:px-0">
              <motion.div variants={imageVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }} className="mb-4 py-3 pl-3 pr-2 rounded">
                <Image
                  src={dashboard.src}
                  width={500}
                  height={500}
                  alt="Dashboard interface"
                  className="rounded-xl main-border-gray mx-auto sm:mx-unset"
                  aria-label="Dashboard interface"
                />
              </motion.div>
              <motion.div variants={imageVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }} className="py-3 pl-3 pr-2 rounded">
                <Image
                  src={signup.src}
                  width={500}
                  height={500}
                  alt="Sign up interface"
                  className="rounded-xl main-border-gray mx-auto sm:mx-unset"
                  aria-label="Sign up interface"
                />
              </motion.div>
            </div>
            <div className="w-full lg:w-1/2 lg:mt-20  pt-12 lg:pt-0 px-2 sm:inline-block">
              <motion.div variants={imageVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }} className="mb-4 py-3 pl-3 pr-2 rounded-lg">
                <Image
                  src={bentoFeatures.src}
                  width={500}
                  height={500}
                  alt="Features overview"
                  className="rounded-xl main-border-gray"
                  aria-label="Features overview"
                />
              </motion.div>
              <motion.div variants={imageVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }} className="py-3 pl-3 pr-2 rounded-lg">
                <Image
                  src={preview.src}
                  width={500}
                  height={500}
                  alt="App preview"
                  className="rounded-xl main-border-gray"
                  aria-label="App preview"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
