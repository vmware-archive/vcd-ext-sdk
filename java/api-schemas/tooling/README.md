# VCD API Tools #
The projects in this folder are tools for working with the vCloud Director APIs.

## Bindings Generator ##
A command line tool for generating Typescript bindings for vCD's XML-based REST API is available in `tooling/bindings-generator`.  The bindings generator can be executed like any typical application.  For instance, execution through Maven:

`mvn exec:java -Dexec.mainClass="com.vmware.vcloud.bindings.generator.BindingsGenerator" -Dexec.args="--help"`

will output the usage info:

```
Usage: BindingsGenerator [options]
  Options:
    -h, --help
      Prints this help message
    -o, --outputDir
      A directory to output custom files to.  If none is specified, the output
      is streamed to standard out.
    -x, --overwrite
      If the specified outputDir is not empty the generator will halt.  Adding
      this flag will DELETE the content of outputDir and force the generator
      to continue
      Default: false
  * -p, --packages
      One or more packages to scan for schema classes.
```

There is also a Maven plugin available at `tooling/vcd-bindings-maven-plugin` to facilitate Typescript generation as part of a Maven project lifecycle.  Typescript can be generated for specific packages by adding the following plugin to an existing POM file:
```xml
<build>
    <plugins>
        <plugin>
            <groupId>com.vmware.vcloud</groupId>
            <artifactId>vcd-bindings-maven-plugin</artifactId>
            <version>1.0.0</version>
            <executions>
                <execution>
                    <phase>generate-sources</phase>
                    <goals>
                        <goal>generate-typescript</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <packages>
                    <package>com.vmware.vcloud.api.rest.schema.ovf</package>
                    <package>com.vmware.vcloud.api.rest.schema.ovf.environment</package>
                    <package>com.vmware.vcloud.api.rest.schema.ovf.vmware</package>
                    <package>com.vmware.vcloud.api.rest.schema.versioning</package>
                    <package>com.vmware.vcloud.api.rest.schema_v1_5</package>
                    <package>com.vmware.vcloud.api.rest.schema_v1_5.extension</package>
                </packages>
            </configuration>
            <dependencies>
                <dependency>
                    <groupId>com.vmware.vcloud</groupId>
                    <artifactId>rest-api-bindings</artifactId>
                    <version>9.1.0</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```
This will output a collection of classes, enums, and barrels that are ready for transpilation.
