desiderata
==========

A cellular automata playground

## Overview

**desiderata** is a javascript/canvas environment in which to view an experimental set of cellular automata.

In this program an **ecosystem** is an environment that may impose some baseline environmental rules, keeps track of time, and ultimately has final say over what can be rendered. A **strategy** or class of patterns determines a ruleset to be experimented with. A **pattern** is a given instance of a **strategy**, in other words, a particular automaton one can view.

## How to use

Load the contents of src/ on a web server (or local hard drive) and hit ecosystem1.html in any browser except IE -- Life is precious, why waste any of it testing IE?

## Current State

**desiderata**'s current capabilities include a single ecosystem within which a single class (which I call the neighbor class) of patterns can be viewed.

However, it is easy to add more classes of patterns; and with extension, ecologies.

This app currently resides in this humble location: http://kenshih.com.s3-website-us-east-1.amazonaws.com/

### The Neighbor Pattern

To Be Described, more.

I call this an "environmental automata" because its visual effect is one that affects the whole field of the ecosystem, rather than seeming like a cell or creature.

 .  | . | .  
 ---|---|--- 
 .  | C | .
 .  | . | .