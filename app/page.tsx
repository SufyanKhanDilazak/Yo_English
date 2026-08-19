import React from 'react'
import Navbar from './components/Navbar'

import WhyUs from './components/WhyUs'
import Courses from './components/Courses'
import ClassDetails from './components/Class'
import ContactForm from './components/Form'
import Footer from './components/Footer'
import Hero from './components/Hero'


const page = () => {
  return (
    <div>
      
      <Navbar/> 
    <Hero/>
      <WhyUs/>
      <Courses/>
      <ClassDetails/>
      <ContactForm/>
      <Footer/>
    
    </div>
  )
}

export default page