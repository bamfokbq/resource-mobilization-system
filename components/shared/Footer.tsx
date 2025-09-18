import React from 'react'
import Link from 'next/link'
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className='h-fit bg-ghs-green p-4'>
            <section className='max-w-4xl mx-auto w-full flex gap-10 flex-col md:flex-row justify-between py-4 md:py-8'>
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xl text-white font-medium'>Quick Links</h3>
                    <ul className='text-light-blue'>
                        <li>
                            <Link href='/explore-data'>Dashboard</Link>
                        </li>
                        <li><Link href='/explore-data'>Survey</Link></li>
                        <li><Link href='/contact-us'>Contact Us</Link></li>
                    </ul>
                </div>
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xl text-white font-medium'>Contact Information</h3>
                    <div className='text-light-blue'>
                        <p>Ghana Health Service ICT Departmental</p>
                        <p>Email: info@ghsict.gov</p>
                        <p>Phone: +233 123 456 789</p>
                    </div>
                </div>

                <div className='flex flex-col gap-4'>
                    <h3 className='text-xl text-white font-medium'>Follow Us</h3>
                    <div className='text-light-blue'>
                        <Link className='flex items-center gap-2' href='https://facebook.com'>
                            <FaLinkedin />
                            <p>Facebook</p>
                        </Link>
                        <Link className='flex items-center gap-2' href='https://facebook.com'>
                            <FaFacebook />
                            <p>LinkedIn</p>
                        </Link>
                        <Link className='flex items-center gap-2' href='https://facebook.com'>
                            <FaTwitter />
                            <p>Twitter</p>
                        </Link>
                    </div>
                </div>
            </section>
        </footer>
    )
}
