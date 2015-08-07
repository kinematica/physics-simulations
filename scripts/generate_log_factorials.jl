function generate_log_factorials(max=100, fname="log_factorials.js")
    isfile(fname) && rm(fname)          # if file exists, remove it
    touch(fname)                        # make it clean
    open(fname, "w") do io              # write to it
        print(io, "Kinematica = new Object();\n\n")
        print(io, "// Define logs of first $max logs of factorials.\n")
        print(io, "Kinematica.log_factorials=")
        print(io, cumsum( [0; log([1:max])] ))  # cumulative sum of log factorials
        print(io, ";\n")
        print(io, "Kinematica.log_binomial=function(n,k){return (this.log_factorials[n] - this.log_factorials[k] - this.log_factorials[(n-k)]);}")
    end
    println("Printed first $max logs of factorials to $fname.")
end
