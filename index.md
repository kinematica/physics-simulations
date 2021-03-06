## Physics Simulations

### Astronomy
[Parallax Distance Measurement:](parallax) Astronomers have several tools for finding the distances between Earth and distant celestial bodies. One of these tools is **parallax measurement**. Parallax is a change in viewing angle (i.e. the direction towards which the viewer looks) of a distant object due to a change in position of the viewer. For example, when you look at distant scenery from a car window, it seems to move much more slowly than nearby objects. Astronomers use the Earth's movement around the sun to measure the parallax of distant objects. This only works for relatively nearby objects; the most distant galaxies are so far away that they don't seem to move at all as we go around the sun. In this demo, you can see how the precision with which we can measure the viewing angle of a celestial body (ΔΘ) and the distance of the object (R) work together to affect the uncertainty in our distance measurement (ΔR). For objects that are nearby (relative to the size of our solar system), we can achieve great precision in our measurements, even with relatively poor angular resolution (e.g. due to blurry telescope images). However, at great distances, even the sharpest telescopes will give wildly large uncertainties in distance. For such distant objects, other methods of distance measurement are required.

### Probability and Entropy
[Ideal Gas in a Container:](gas-container) Put a bunch of gas particles in a container and set them loose in random directions. The more you add, the more likely you are to see them evenly distributed between the two sides of the container! Simply put, there are *more ways to rearrange them if you split them (roughly) evenly*. For example, if you have four particles (let's creatively name them *1*, *2*, *3*, and *4*), there's only one possible combination with all four of them on the left: 1, 2, 3, and 4 on the left, none on the right. But if you split them evenly, there are *six* different ways to arrange them (the "|" symbol splits the left and right sides):

(1 2 &#124; 3 4)<br/>
(1 3 &#124; 2 4)<br/>
(1 4 &#124; 2 3)<br/>
(2 3 &#124; 1 4)<br/>
(2 4 &#124; 1 3)<br/>
(3 4 &#124; 1 2)

The logarithm of the number of possible combinations is called the **entropy**. So, in the above example, the entropy of having two particles on each side is log(6), which is about 1.8. The entropy of having them all on one side gives an entropy of log(1), which is 0. Physical systems like to be in states where they have a lot of choices—in other words, they prefer high entropy states. In this example, that means that you're *much more likely to see the particles be evenly split between the two sides*, and that's especially true as you add more particles! We made this especially visual clear using the brightness of the blue background, which gets brighter as the percentage of balls on each side increases. Notice that, even if all the balls start on the same side, they eventually get pretty evenly mixed, and both sides of the screen stay nearly the same shade of blue!.

### Rotation
[Precession of a Spinning Wheel:](gyro/index-precession.html) Hang one side of a spinning bike wheel from a rope, and put a heavy weight on the other side. You'd naturally expect the wheel to just fall and dangle, but the *spinning* of the tire—its **angular momentum**—causes it to *precess* about the rope! Try playing with the mass of the weight and the speed of the tire, and see how it affects the speed of precession!

### Special relativity
[Light Particles on a Train:](sr) Let's say you flashed a light in the middle of a moving train for just a split second—long enough to release a single light particle, or **photon**. If you're sitting in the train, you'd see the photons hit the opposite walls of the train at the same time. Naturally, someone standing by the side of the tracks would likely agree with you. But, if the train was moving fast enough—close to the speed of light—then *the observer on the side of the road would see the backward-moving photon hit the back of the train first! See it from both perspectives in this demo, and notice how strong the effect is when the train's speed gets close to *c*, the speed of light.

## About Us
[Kinematica](../) is a couple of students in Columbia's Physics Department making fun physics demos and software tools for physics education. Our goals are to find elegant ways to illustrate nonintuitive phenomena through interactive physics demonstrations, and to make it easier for other people to make beautiful physics demos of their own.

## Contributors
Stefan Countryman: @stefco

Michael Carapezza: @mac2305

Liutauras Rusaitis: @rusaitis
